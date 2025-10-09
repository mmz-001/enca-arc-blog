import { INP_CHS, VIS_CHS } from '../constants'
import { encodingFn } from './color'
import type { Grid } from './grid'
import type { NCA, NCAEnsemble } from './nca'
import { Substrate } from './substrate'

export type TerminationReason = 'max_steps' | 'convergence'

export class NCAExecutor {
  nca: NCA
  substrate: Substrate
  steps: number
  prev_substrate: Substrate
  reason?: TerminationReason

  constructor(nca: NCA, substrate: Substrate)
  constructor(
    nca: NCA,
    substrate: Substrate,
    steps: number,
    prev_substrate: Substrate,
    reason: TerminationReason | undefined
  )
  constructor(
    nca: NCA,
    substrate: Substrate,
    steps?: number,
    prev_substrate?: Substrate,
    reason?: TerminationReason
  ) {
    this.nca = nca
    this.substrate = substrate
    this.steps = steps ? steps : 0
    this.prev_substrate = prev_substrate ? prev_substrate : substrate.clone()
    this.reason = reason
  }

  step(): TerminationReason | undefined {
    if (this.steps >= this.nca.maxSteps) {
      this.reason = 'max_steps'
      return this.reason
    }

    this.prev_substrate = this.substrate.clone()

    this.nca.update(this.substrate)
    this.steps += 1

    let maxAbsDiff = 0.0

    for (let y = 0; y < this.substrate.height; y++) {
      for (let x = 0; x < this.substrate.width; x++) {
        for (let c = 0; c < this.substrate.channels; c++) {
          const s = this.substrate.get(y, x, c)
          const ps = this.prev_substrate.get(y, x, c)
          const absDiff = Math.abs(ps - s)
          if (absDiff > maxAbsDiff) {
            maxAbsDiff = absDiff
          }
        }
      }
    }

    if (maxAbsDiff < 0.25) {
      this.reason = 'convergence'
      return this.reason
    }
  }

  clone(): NCAExecutor {
    const cloned = new NCAExecutor(
      this.nca,
      this.substrate.clone(),
      this.steps,
      this.prev_substrate.clone(),
      this.reason
    )

    return cloned
  }
}

export class ENCA {
  ensemble: NCAEnsemble
  executors: NCAExecutor[]
  curExecIdx: number
  steps: number
  terminated: boolean

  constructor(
    ensemble: NCAEnsemble,
    executors: NCAExecutor[],
    curExecIndx: number,
    steps: number,
    terminated: boolean
  ) {
    this.ensemble = ensemble
    this.executors = executors
    this.curExecIdx = curExecIndx
    this.steps = steps
    this.terminated = terminated
  }

  static fromEnsembleGrid(ensemble: NCAEnsemble, grid: Grid): ENCA {
    if (ensemble.transform) {
      ensemble.transform.apply(grid)
    }

    const substrate = Substrate.fromGrid(grid, encodingFn)

    const executors = ensemble.ncas.map(
      (nca) => new NCAExecutor(nca, substrate.clone())
    )
    const curExecIdx = 0
    const steps = 0
    return new ENCA(ensemble, executors, curExecIdx, steps, false)
  }

  step(): boolean {
    const curExecutor = this.executors[this.curExecIdx]

    const reason = curExecutor.step()
    this.steps++

    if (!reason) {
      return false
    }

    if (this.curExecIdx < this.executors.length - 1) {
      const substrate = this.executors[this.curExecIdx].substrate.clone()

      for (let y = 0; y < substrate.height; y++) {
        for (let x = 0; x < substrate.width; x++) {
          for (let c = 2 * VIS_CHS; c < INP_CHS; c++) {
            substrate.set(y, x, c, 0.0)
          }
        }
      }

      this.curExecIdx += 1

      this.executors[this.curExecIdx].substrate = substrate.clone()
      this.executors[this.curExecIdx].prev_substrate = substrate.clone()

      return false
    }

    this.terminated = true
    return this.terminated
  }

  clone(): ENCA {
    const cloned = new ENCA(
      this.ensemble, // NCAs doesn't mutate,
      this.executors.map((exec) => exec.clone()),
      this.curExecIdx,
      this.steps,
      this.terminated
    )

    return cloned
  }
}

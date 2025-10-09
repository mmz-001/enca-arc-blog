import array from '@stdlib/ndarray/array'
import type { float32ndarray } from '@stdlib/types/ndarray'
import { INP_CHS, NHBD_VON_NEUMANN, OUT_CHS, VIS_CHS } from '../constants'
import { Substrate } from './substrate'
import type { RemapColors } from './transforms'

export class NCA {
  readonly weights: float32ndarray
  readonly biases: float32ndarray
  readonly maxSteps: number

  constructor(weights: number[], biases: number[], maxSteps: number) {
    this.weights = array(weights, {
      dtype: 'float32',
      casting: 'unsafe',
      readonly: true,
    }) as float32ndarray

    this.biases = array(biases, {
      dtype: 'float32',
      casting: 'unsafe',
      readonly: true,
    }) as float32ndarray

    this.maxSteps = maxSteps
  }

  update(substrate: Substrate) {
    const next = substrate.clone()
    const h = substrate.height
    const w = substrate.width

    const out_buf = new Array(OUT_CHS).fill(0)

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        for (let i = 0; i < OUT_CHS; i++) {
          out_buf[i] = this.biases.get(i)
        }

        for (let k = 0; k < NHBD_VON_NEUMANN.length; k++) {
          const nx = x + NHBD_VON_NEUMANN[k][0]
          const ny = y + NHBD_VON_NEUMANN[k][1]

          if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
            // Out of bounds
            continue
          }

          for (let inpIdx = 0; inpIdx < INP_CHS; inpIdx++) {
            const nv = substrate.get(ny, nx, inpIdx)

            if (nv < 0.5) {
              continue
            }

            const colIdx = inpIdx * NHBD_VON_NEUMANN.length + k

            for (let outIdx = 0; outIdx < OUT_CHS; outIdx++) {
              const wi = outIdx * NHBD_VON_NEUMANN.length * INP_CHS + colIdx
              out_buf[outIdx] += nv * this.weights.get(wi)
            }
          }
        }

        for (let ch = 0; ch < OUT_CHS; ch++) {
          const s = Math.max(0, Math.min(1, out_buf[ch]))
          next.set(y, x, ch + VIS_CHS, s)
        }
      }
    }

    substrate.data = next.data
  }
}

export type NCAEnsemble = {
  taskId: string
  ncas: NCA[]
  transform?: RemapColors
}

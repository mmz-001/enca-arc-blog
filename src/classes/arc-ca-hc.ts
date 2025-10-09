import { Grid } from './grid'
import { Substrate } from './substrate'

const encodingFn = (c: number) => (c == 8 ? [1, 0] : [0, 0])
const visDecodingFn = (s: number[]) => (s[0] == 1 ? 8 : 0)
const hidDecodingFn = (s: number[]) => (s[1] == 1 ? 5 : 0)

export class ARCCAHC {
  visGrid: Grid
  hidGrid: Grid
  substrate: Substrate
  readonly visible: number
  readonly hidden: number

  constructor(data: number[][]) {
    this.visGrid = new Grid(data)
    this.hidGrid = Grid.zeros({
      height: this.visGrid.height,
      width: this.visGrid.width,
    })
    this.substrate = Substrate.fromGrid(this.visGrid, encodingFn)
    this.visible = 8
    this.hidden = 5
  }

  clone(): ARCCAHC {
    const instance = Object.create(ARCCAHC.prototype)
    instance.visGrid = this.visGrid.clone()
    instance.hidGrid = this.hidGrid.clone()
    instance.substrate = this.substrate.clone()
    instance.visible = this.visible
    instance.hidden = this.hidden
    return instance
  }

  step() {
    const h = this.substrate.height
    const w = this.substrate.width

    const next: number[][][] = Array.from({ length: h }, (_, i) =>
      Array.from({ length: w }, (_, j) => {
        let aliveHidNeigh = 0

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue

            const y = i + dy
            const x = j + dx

            if (y < 0 || y >= h || x < 0 || x >= w) {
              continue
            }

            aliveHidNeigh += this.substrate.get(y, x, 1)
          }
        }

        const visAlive = this.substrate.get(i, j, 0) > 0
        const hidAlive = this.substrate.get(i, j, 1) > 0

        if (!visAlive && !hidAlive) {
          return [0, 1]
        }

        if (hidAlive && (aliveHidNeigh == 3 || aliveHidNeigh == 5)) {
          return [1, 1]
        }

        return [0, 1]
      })
    )

    this.substrate = new Substrate(next)
    this.visGrid = this.substrate.toGrid(visDecodingFn)
    this.hidGrid = this.substrate.toGrid(hidDecodingFn)
  }
}

import { Grid } from './grid'

export class CGoL {
  grid: Grid
  readonly color: number
  wrap: boolean

  constructor(data: number[][], opts?: { wrap?: boolean }) {
    this.grid = new Grid(data)
    this.color = data.flat().find((v) => v != 0) || 1
    this.wrap = opts?.wrap ?? true
  }

  step() {
    const h = this.grid.height
    const w = this.grid.width

    const next: number[][] = Array.from({ length: h }, (_, i) =>
      Array.from({ length: w }, (_, j) => {
        let neighbors = 0

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue

            let y = i + dy
            let x = j + dx

            if (this.wrap) {
              y = (y + h) % h
              x = (x + w) % w
            } else {
              if (y < 0 || y >= h || x < 0 || x >= w) {
                continue
              }
            }

            neighbors += this.grid.get(y, x) === this.color ? 1 : 0
          }
        }

        const alive = this.grid.get(i, j) === this.color
        if (alive) {
          return neighbors === 2 || neighbors === 3 ? this.color : 0
        }
        return neighbors === 3 ? this.color : 0
      })
    )

    this.grid = new Grid(next)
  }
}

import { Grid } from './grid'

export class RemapColors {
  colMap: number[]
  revColMap: number[]

  constructor(colMap: number[], revColMap: number[]) {
    this.colMap = colMap
    this.revColMap = revColMap
  }

  apply(grid: Grid) {
    this.remap_grid(grid, this.colMap)
  }

  revert(grid: Grid) {
    this.remap_grid(grid, this.revColMap)
  }

  private remap_grid(grid: Grid, map: number[]) {
    const width = grid.width
    const height = grid.height

    const newGrid = Grid.zeros({ height, width })

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        newGrid.set(y, x, map[grid.get(y, x)])
      }
    }

    grid.data = newGrid.data
  }
}

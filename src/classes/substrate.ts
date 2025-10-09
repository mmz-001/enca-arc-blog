import array from '@stdlib/ndarray/array'
import type { float32ndarray } from '@stdlib/types/ndarray'
import { Grid } from './grid'

type EncodingFn = (c: number) => number[]
type DecodingFn = (s: number[]) => number

export class Substrate {
  data: float32ndarray
  readonly width: number
  readonly height: number
  readonly channels: number

  constructor(data: number[][][]) {
    if (data.length == 0) {
      throw Error('data is empty')
    }
    if (data[0].length == 0) {
      throw Error('data[0] is empty')
    }

    if (data[0][0].length == 0) {
      throw Error('data[0][0] is empty')
    }

    this.data = array(data, {
      dtype: 'float32',
      casting: 'unsafe',
      readonly: false,
    }) as float32ndarray

    this.height = this.data.shape[0]
    this.width = this.data.shape[1]
    this.channels = this.data.shape[2]
  }

  get(i: number, j: number, c: number) {
    return this.data.get(i, j, c)
  }

  set(i: number, j: number, c: number, value: number) {
    this.data.set(i, j, c, value)
  }

  clone(): Substrate {
    const data = Array.from({ length: this.height }, (_, i) =>
      Array.from({ length: this.width }, (_, j) =>
        Array.from({ length: this.channels }, (_, c) => this.get(i, j, c))
      )
    )
    return new Substrate(data)
  }

  toGrid(decodingFn: DecodingFn): Grid {
    const gridData: number[][] = []

    for (let i = 0; i < this.height; i++) {
      const row: number[] = []
      for (let j = 0; j < this.width; j++) {
        const state: number[] = new Array(this.channels)
        for (let c = 0; c < this.channels; c++) {
          state[c] = this.get(i, j, c)
        }
        row.push(decodingFn(state))
      }
      gridData.push(row)
    }

    return new Grid(gridData)
  }

  static fromGrid(grid: Grid, encodingFn: EncodingFn): Substrate {
    const { height, width } = grid
    const data: number[][][] = new Array(height)

    for (let i = 0; i < height; i++) {
      const row: number[][] = new Array(width)
      for (let j = 0; j < width; j++) {
        const encoded = encodingFn(grid.get(i, j))
        row[j] = encoded
      }
      data[i] = row
    }

    return new Substrate(data)
  }

  static zeros(shape: {
    height: number
    width: number
    channels: number
  }): Substrate {
    const data: number[][][] = Array.from({ length: shape.height }, () =>
      Array.from({ length: shape.width }, () =>
        Array.from({ length: shape.channels }, () => 0)
      )
    )
    return new Substrate(data)
  }
}

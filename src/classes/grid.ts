import array from '@stdlib/ndarray/array'
import type { uint8ndarray } from '@stdlib/types/ndarray'

export class Grid {
  data: uint8ndarray
  readonly width: number
  readonly height: number

  constructor(data: number[][]) {
    if (data.length == 0) {
      throw Error('data is empty')
    }
    if (data[0].length == 0) {
      throw Error('data[0] is empty')
    }

    this.data = array(data, {
      dtype: 'uint8',
      casting: 'unsafe',
      readonly: false,
    }) as uint8ndarray

    this.height = this.data.shape[0]
    this.width = this.data.shape[1]
  }

  get(i: number, j: number) {
    return this.data.get(i, j)
  }

  set(i: number, j: number, val: number) {
    return this.data.set(i, j, val)
  }

  clone(): Grid {
    const data: number[][] = []
    for (let i = 0; i < this.height; i++) {
      const row: number[] = []
      for (let j = 0; j < this.width; j++) {
        row.push(this.get(i, j))
      }
      data.push(row)
    }
    return new Grid(data)
  }

  static zeros(shape: { height: number; width: number }): Grid {
    return new Grid(
      Array.from({ length: shape.height }, () => Array(shape.width).fill(0))
    )
  }
}

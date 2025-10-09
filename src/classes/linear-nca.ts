import array from '@stdlib/ndarray/array'
import type { float32ndarray } from '@stdlib/types/ndarray'
import { Substrate } from './substrate'
import { NHBD_MOORE } from '../constants'

export class LinearNCA {
  readonly weights: float32ndarray

  constructor(weights: number[]) {
    this.weights = array(weights, {
      dtype: 'float32',
      casting: 'unsafe',
      readonly: true,
    }) as float32ndarray
  }

  update(substrate: Substrate) {
    const next = Array.from({ length: substrate.height }, () =>
      Array.from({ length: substrate.width }, () => 0)
    )
    for (let y = 0; y < substrate.height; y++) {
      for (let x = 0; x < substrate.width; x++) {
        let val = 0
        for (let k = 0; k < NHBD_MOORE.length; k++) {
          const [dx, dy] = NHBD_MOORE[k]
          const nx = x + dx
          const ny = y + dy

          const neigh =
            nx < 0 || nx >= substrate.width || ny < 0 || ny >= substrate.height
              ? 0
              : substrate.get(ny, nx, 0)

          val += neigh * this.weights.get(k)
        }
        next[y][x] = val
      }
    }

    for (let y = 0; y < substrate.height; y++) {
      for (let x = 0; x < substrate.width; x++) {
        substrate.set(y, x, 0, next[y][x])
      }
    }
  }
}

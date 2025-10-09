import { OUT_CHS, VIS_CHS } from '../constants'

const ENCODING = [
  [0, 0, 0, 0],
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [1, 0, 1, 0],
  [1, 0, 0, 1],
  [0, 1, 1, 0],
  [0, 1, 0, 1],
  [0, 0, 1, 1],
]

export function encodingFn(c: number): number[] {
  return [...ENCODING[c], ...new Array(OUT_CHS).fill(0.0)]
}

export function decodingFn(s: number[]): number {
  let st = s.slice(VIS_CHS, 2 * VIS_CHS)
  st = st.map((x) => (x > 0.5 ? 1.0 : 0.0))
  let bestIdx = 0
  let bestDot = -Infinity

  for (let i = 0; i < ENCODING.length; i++) {
    const proto = ENCODING[i]
    const dot = proto.map((v, i) => v * st[i]).reduce((pv, cv) => pv + cv, 0)
    if (dot > bestDot) {
      bestDot = dot
      bestIdx = i
    }
  }
  return bestIdx
}

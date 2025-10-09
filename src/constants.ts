export const COLOR_MAP: string[] = [
  '#000000', // 0: black #000000
  '#0074d9', // 1: blue #0074D9
  '#ff4136', // 2: red #FF4136
  '#2ecc40', // 3: green #2ECC40
  '#ffdc00', // 4: yellow #FFDC00
  '#aaaaaa', // 5: grey #AAAAAA
  '#f012be', // 6: fuchsia #F012BE
  '#ff851b', // 7: orange #FF851B
  '#7fdbff', // 8: teal #7FDBFF
  '#870c25', // 9: brown #870C25
]

// Von-Neumann neighborhood
// prettier-ignore
export const NHBD_VON_NEUMANN: [number, number][] = [
              [ 0,-1],
     [-1, 0], [ 0, 0], [1, 0],
              [ 0, 1]
];

// Moore neighborhood
// prettier-ignore
export const NHBD_MOORE: [number, number][] = [
     [-1,-1], [ 0,-1], [1,-1],
     [-1, 0], [ 0, 0], [1, 0],
     [-1, 1], [ 0, 1], [1, 1],
];

export const VIS_CHS = 4
export const HID_CHS = 1
export const OUT_CHS = VIS_CHS + HID_CHS
export const INP_CHS = VIS_CHS * 2 + HID_CHS

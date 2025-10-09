export function ascii2Array(ascii: string, fill: number): number[][] {
  // Convert ascii art to number[][] using 'O' => fill, '.' => 0.
  // Whitespace is removed; ragged rows are right-padded with '.'.
  const lines = ascii
    .split('\n')
    .map((l) => l.replace(/\s+/g, ''))
    .filter((l) => l.length > 0)

  if (lines.length === 0) return []

  const width = Math.max(...lines.map((l) => l.length))

  return lines
    .map((l) => (l.length < width ? l.padEnd(width, '.') : l))
    .map((row) =>
      Array.from(row, (ch) => {
        if (ch === 'O') return fill
        if (ch === '.') return 0
        throw new Error(
          `ascii2Array: unsupported character '${ch}'. Only 'O' and '.' are allowed.`
        )
      })
    )
}

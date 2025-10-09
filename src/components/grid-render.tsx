import { COLOR_MAP } from '../constants'
import type { Grid } from '../classes/grid'

export function GridRender({
  grid,
  className = 'w-20',
}: {
  grid: Grid
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className='grid w-full'
        style={{
          gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
        }}
      >
        {[...new Array(grid.height)].map((_, y) =>
          [...new Array(grid.width)].map((_, x) => (
            <div
              key={`${y}-${x}`}
              className='border border-neutral-800 -m-[0.5px]'
              style={{
                aspectRatio: '1 / 1',
                backgroundColor: COLOR_MAP[grid.get(y, x)] ?? '#000000',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

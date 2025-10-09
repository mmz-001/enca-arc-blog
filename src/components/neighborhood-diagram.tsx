import { MathInline } from './math-inline'

type NeighborhoodType = 'von-neumann' | 'moore'

interface CellProps {
  index: number | null
  isCenter: boolean
  isActive: boolean
}

function Cell({ index, isCenter, isActive }: CellProps) {
  return (
    <div
      className={`
        w-12 h-12 flex items-center justify-center
        border-1 text-sm font-mono
        ${
          !isActive
            ? 'border-neutral-800 bg-neutral-950'
            : isCenter
            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
            : 'border-neutral-600 bg-neutral-800 text-neutral-300'
        }
      `}
    >
      {isActive && index !== null && <span>{index}</span>}
    </div>
  )
}

function NeighborhoodGrid({ type }: { type: NeighborhoodType }) {
  const isVonNeumann = type === 'von-neumann'

  const grid = []
  let activeIndex = 0

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const isCenter = row === 1 && col === 1
      let isActive = false

      if (isVonNeumann) {
        isActive =
          isCenter ||
          (row === 0 && col === 1) ||
          (row === 2 && col === 1) ||
          (row === 1 && col === 0) ||
          (row === 1 && col === 2)
      } else {
        isActive = true
      }

      const cellIndex = isActive ? activeIndex : null
      if (isActive) activeIndex++

      grid.push(
        <Cell
          key={`${row}-${col}`}
          index={cellIndex}
          isCenter={isCenter}
          isActive={isActive}
        />
      )
    }
  }

  return <div className='grid grid-cols-3 gap-1 w-fit'>{grid}</div>
}

export function NeighborhoodDiagram() {
  return (
    <div className='not-prose py-4 flex flex-col items-center'>
      <div className='flex flex-col md:flex-row gap-4 sm:gap-8 items-start justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <h3 className=' text-neutral-100 text-xs sm:text-sm'>
            Von Neumann Neighborhood
          </h3>

          <NeighborhoodGrid type='von-neumann' />

          <p className='text-xs text-neutral-200 text-center max-w-[200px]'>
            <MathInline expr='K = 5' />
          </p>
        </div>

        <div className='flex flex-col items-center gap-3'>
          <h3 className=' text-neutral-100 text-xs sm:text-sm'>
            Moore Neighborhood
          </h3>

          <NeighborhoodGrid type='moore' />

          <p className='text-xs text-neutral-200 text-center max-w-[200px]'>
            <MathInline expr='K = 9' />
          </p>
        </div>
      </div>

      <div className='mt-4 flex items-center justify-center gap-4 text-xs'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 border-2 border-blue-500 bg-blue-500/20'></div>

          <span className='text-neutral-400'>Center cell</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 border-2 border-neutral-500 bg-neutral-800'></div>

          <span className='text-neutral-400'>Neighbor cell</span>
        </div>
      </div>
    </div>
  )
}

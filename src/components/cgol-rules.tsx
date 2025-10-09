import { Grid } from '../classes/grid'
import { GridRender } from './grid-render'
import { MathInline } from './math-inline'

type Transition = { before: number[][]; after: number[][] }

function RulePanel({
  title,
  transition,
  description,
}: {
  title: string
  transition: Transition
  description: string
}) {
  return (
    <div className='rounded-lg border border-neutral-700 bg-neutral-800 p-4 flex flex-col gap-6'>
      <div className='flex flex-col gap-0.5'>
        <h3 className='font-medium text-neutral-100 text-sm'>{title}</h3>
        <h4 className='text-xs text-neutral-400 '>{description}</h4>
      </div>

      <div className='flex items-center gap-3 mx-auto pb-6'>
        <div className='flex flex-col items-center gap-1 relative'>
          <span className='text-xs text-neutral-300 absolute -bottom-[24px]'>
            <MathInline expr='S^{t}_{i, j}' />
          </span>
          <GridRender grid={new Grid(transition.before)} className='w-20' />
        </div>
        <div className='text-neutral-400 text-lg sm:text-xl'>→</div>
        <div className='flex flex-col items-center gap-1 relative'>
          <span className='text-xs text-neutral-300 absolute -bottom-[24px]'>
            <MathInline expr='S^{t+1}_{i, j}' />
          </span>
          <GridRender grid={new Grid(transition.after)} className='w-20' />
        </div>
      </div>
    </div>
  )
}

export function CGoLRulesDiagram() {
  const underpopulation: Transition = {
    before: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    after: [
      [1, 0, 0],
      [0, 0, 0], // center dies
      [0, 0, 0],
    ],
  }

  const survival: Transition = {
    before: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    after: [
      [0, 0, 0],
      [1, 1, 1], // center lives
      [0, 0, 0],
    ],
  }

  const overpopulation: Transition = {
    before: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    after: [
      [0, 1, 0],
      [1, 0, 1], // center dies
      [0, 1, 0],
    ],
  }

  const reproduction: Transition = {
    before: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ],
    after: [
      [0, 1, 0],
      [1, 1, 1], // center becomes alive
      [0, 0, 0],
    ],
  }

  return (
    <div className='not-prose py-2'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <RulePanel
          title='Underpopulation'
          transition={underpopulation}
          description='A living cell with fewer than 2 living neighbors dies.'
        />
        <RulePanel
          title='Survival'
          transition={survival}
          description='A living cell with 2 or 3 living neighbors survives.'
        />
        <RulePanel
          title='Overpopulation'
          transition={overpopulation}
          description='A living cell with more than 3 living neighbors dies.'
        />
        <RulePanel
          title='Reproduction'
          transition={reproduction}
          description='A dead cell with exactly 3 living neighbors becomes alive.'
        />
      </div>

      <div className='my-2 text-xs text-neutral-400 text-center'>
        The center cell updates based on its 8 neighbors. Updates to surrounding
        cells are not shown.
      </div>
    </div>
  )
}

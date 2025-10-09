import { ArrowRight } from 'lucide-react'
import { Grid } from '../classes/grid'
import { ARC_DATA } from '../data/arc-grids'
import { GridRender } from './grid-render'

function ARCExample({
  example,
}: {
  example: { input: number[][]; output: number[][] }
}) {
  return (
    <div className='flex items-stretch gap-2'>
      <div className='flex flex-col gap-1'>
        <div className='text-xs text-neutral-400'>Input</div>
        <GridRender
          grid={new Grid(example['input'])}
          className='w-30 sm:w-40'
        />
      </div>
      <div className='items-center flex mt-5'>
        <ArrowRight size={16} />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-xs text-neutral-400'>Output</div>
        <GridRender
          grid={new Grid(example['output'])}
          className='w-30 sm:w-40'
        />
      </div>
    </div>
  )
}

function ARCTest({ test }: { test: { input: number[][] } }) {
  return (
    <div className='flex items-stretch gap-2'>
      <div className='flex flex-col gap-1'>
        <div className='text-xs text-neutral-400'>Input</div>
        <GridRender grid={new Grid(test['input'])} className='w-30 sm:w-40' />
      </div>
      <div className='flex items-center'>
        <ArrowRight size={16} />
      </div>
      <div className='flex items-center justify-center '>
        <div className=' text-neutral-400 w-20 my-4'>
          <div className='text-lg text-center'>?</div>
        </div>
      </div>
    </div>
  )
}

export function ARCTask({ id }: { id: string }) {
  const task = ARC_DATA[id]
  return (
    <div className=''>
      <div className='flex flex-col sm:flex-row justify-between gap-6 sm:gap-12 p-4 sm:p-6 rounded-lg border border-neutral-700 bg-neutral-800'>
        <div className='flex flex-col gap-2 sm:gap-4 -mt-1'>
          <div className='font-semibold text-neutral-300'>Examples</div>
          {task['train'].map((example, i) => (
            <ARCExample example={example} key={i} />
          ))}
        </div>
        <div className='flex flex-col gap-2 sm:gap-4 -mt-1'>
          <div className='font-semibold text-neutral-300'>Test</div>
          {task['test'].map((test, i) => (
            <ARCTest test={test} key={i} />
          ))}
        </div>
      </div>
      <div className='my-2 text-xs text-neutral-400 text-center'>
        {`ARC-AGI-1 puzzle #${id}`}
      </div>
    </div>
  )
}

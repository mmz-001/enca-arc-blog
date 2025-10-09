import { CGoLMachine } from '../machines/sm-cgol-demo'
import { GridRender } from './grid-render'
import { useActorRef, useSelector } from '@xstate/react'
import { CGoL as CGolClass } from '../classes/cgol'
import { Pause, Play } from 'lucide-react'

export function CGoL({
  title,
  grid,
  wrap = true,
}: {
  title: string
  grid: number[][]
  wrap?: boolean
}) {
  const CGoLMachineActorRef = useActorRef(CGoLMachine, {
    input: {
      CGoL: new CGolClass(grid, {
        wrap,
      }),
    },
  })

  const { playing, paused, currentGrid } = useSelector(
    CGoLMachineActorRef,
    (state) => ({
      playing: state.matches('playing'),
      paused: state.matches('paused'),
      currentGrid: state.context.CGoL.grid,
    })
  )

  const handleClick = () => {
    if (paused) {
      CGoLMachineActorRef.send({
        type: 'play',
      })
    }

    if (playing) {
      CGoLMachineActorRef.send({
        type: 'pause',
      })
    }
  }

  return (
    <div className=''>
      <div className='' onClick={handleClick}>
        <GridRender grid={currentGrid} className='w-40' />
      </div>
      <div className='flex gap-2 items-center mt-2'>
        <button
          className='cursor-pointer hover:border-white border rounded-full border-neutral-500  flex justify-center items-center size-7'
          onClick={handleClick}
        >
          {paused && <Play size={14} fill='white' />}
          {playing && <Pause size={14} fill='white' />}
        </button>
        <div className='text-neutral-400 text-sm'>{title}</div>
      </div>
    </div>
  )
}

import { GridRender } from './grid-render'
import { useActorRef, useSelector } from '@xstate/react'
import { ARCCAHC as ARCCAHCClass } from '../classes/arc-ca-hc'
import { ARCCAHCMachine } from '../machines/sm-arc-ca-hc'
import { Pause, Play, RotateCcw } from 'lucide-react'

export function ARCCAHC() {
  const ARCCAHCMachineActorRef = useActorRef(ARCCAHCMachine, {
    input: {
      ARCCAHC: new ARCCAHCClass([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]),
    },
  })

  const { playing, paused, visGrid, hidGrid } = useSelector(
    ARCCAHCMachineActorRef,
    (state) => ({
      playing: state.matches('playing'),
      paused: state.matches('paused'),
      visGrid: state.context.ARCCAHC.visGrid,
      hidGrid: state.context.ARCCAHC.hidGrid,
    })
  )

  const handleClick = () => {
    if (paused) {
      ARCCAHCMachineActorRef.send({
        type: 'play',
      })
    }

    if (playing) {
      ARCCAHCMachineActorRef.send({
        type: 'pause',
      })
    }
  }

  return (
    <div className='flex gap-6 rounded-lg border border-neutral-700 bg-neutral-800 p-6  overflow-x-auto w-min mx-auto'>
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
        <div className=''>
          <div className='' onClick={handleClick}>
            <GridRender grid={visGrid} className='w-50' />
          </div>
          <div className='flex gap-2 items-center mt-2'>
            <div className='text-neutral-400 text-sm'>Visible channel</div>
          </div>
        </div>
        <div className=''>
          <div className='' onClick={handleClick}>
            <GridRender grid={hidGrid} className='w-50' />
          </div>
          <div className='flex gap-2 items-center mt-2'>
            <div className='text-neutral-400 text-sm'>Hidden channel</div>
          </div>
        </div>
      </div>
      <div className='flex gap-2 flex-col'>
        <button
          className='cursor-pointer hover:border-white border rounded-full border-neutral-500 flex justify-center items-center size-7'
          onClick={handleClick}
        >
          {paused && <Play size={14} fill='white' />}
          {playing && <Pause size={14} fill='white' />}
        </button>
        <button
          className='cursor-pointer border rounded-full border-neutral-500 hover:border-white flex justify-center items-center size-7'
          onClick={() =>
            ARCCAHCMachineActorRef.send({
              type: 'reset',
            })
          }
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )
}

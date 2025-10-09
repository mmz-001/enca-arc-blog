import { useActorRef, useSelector } from '@xstate/react'
import { LinearNCAMachine as machine } from '../machines/sm-linear-nca'
import { LinearNCA as LinearNCAClass } from '../classes/linear-nca'
import { Substrate } from '../classes/substrate'
import { SubstrateRender } from './substrate-render'
import { Pause, Play, RotateCcw } from 'lucide-react'

export function LinearNCA() {
  const actorRef = useActorRef(machine, {
    input: {
      linearNCA: new LinearNCAClass([
        -0.1, -0.1, -0.1, 0.1, 0.3, 0.1, 0.2, 0.2, 0.2,
      ]),
      substrate: (() => {
        const [w, h] = [15, 15]
        const substrate = Substrate.zeros({
          height: h,
          width: w,
          channels: 1,
        })
        const centerY = Math.floor(h / 2)
        const centerX = Math.floor(w / 2)
        const size = 4
        for (let y = centerY - size; y <= centerY + size; y++) {
          for (let x = centerX - size; x <= centerX + size; x++) {
            substrate.set(y, x, 0, 1.0)
          }
        }
        return substrate
      })(),
    },
  })

  const { playing, paused, substrate } = useSelector(actorRef, (state) => ({
    playing: state.matches('playing'),
    paused: state.matches('paused'),
    substrate: state.context.substrate,
  }))

  const handleClick = () => {
    if (paused) {
      actorRef.send({
        type: 'play',
      })
    }

    if (playing) {
      actorRef.send({
        type: 'pause',
      })
    }
  }

  const handleReset = () => {
    actorRef.send({
      type: 'reset',
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex gap-6 rounded-lg border border-neutral-700 bg-neutral-800 p-6 overflow-x-auto w-min not-prose'>
        <div className=''>
          <div className='' onClick={handleClick}>
            <SubstrateRender
              substrate={substrate}
              channel={0}
              className='w-50 sm:w-60'
            />
          </div>
        </div>
        <div className='flex gap-2 flex-col'>
          <button
            className='cursor-pointer  border rounded-full border-neutral-500 hover:border-white flex justify-center items-center size-7'
            onClick={handleClick}
          >
            {paused && <Play size={14} fill='white' />}
            {playing && <Pause size={14} fill='white' />}
          </button>
          <button
            className='cursor-pointer  border rounded-full border-neutral-500 hover:border-white flex justify-center items-center size-7'
            onClick={handleReset}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className='my-2 text-xs text-neutral-400 '>
        A new class of emergent behaviors is unlocked with NCAs.
      </div>
    </div>
  )
}

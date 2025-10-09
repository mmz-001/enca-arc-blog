import { GridRender } from './grid-render'
import { shallowEqual, useActorRef, useSelector } from '@xstate/react'
import { ENCA as ENCAClass } from '../classes/executors'
import { ENCAMachine as machine } from '../machines/sm-enca'
import {
  Pause,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { ENCAS } from '../data/encas'
import { NCA } from '../classes/nca'
import { ARC_DATA } from '../data/arc-grids'
import { Grid } from '../classes/grid'
import { decodingFn } from '../classes/color'
import { SubstrateRender } from './substrate-render'
import { RemapColors } from '../classes/transforms'
import { COLOR_MAP } from '../constants'
import { useState } from 'react'
import type { ActorRefFrom } from 'xstate'

type ENCAActorRef = ActorRefFrom<typeof machine>

function GridDisplay({
  actorRef,
  revertColors,
  onClickHandler,
}: {
  actorRef: ENCAActorRef
  revertColors: boolean
  onClickHandler: () => void
}) {
  const { substrate, transform } = useSelector(actorRef, (state) => ({
    substrate:
      state.context.ENCA.executors[state.context.ENCA.curExecIdx].substrate,
    transform: state.context.ENCA.ensemble.transform,
  }))

  const grid =
    transform && revertColors
      ? (() => {
          const grid = substrate.toGrid(decodingFn)
          transform.revert(grid)
          return grid
        })()
      : substrate.toGrid(decodingFn)

  return (
    <div className=''>
      <div className='' onClick={onClickHandler}>
        <GridRender grid={grid} className='w-50' />
      </div>
      <div className='flex gap-2 items-center mt-3'>
        <div className='text-neutral-400 text-xs'>Decoded grid</div>
      </div>
    </div>
  )
}

function SubstrateDisplay({
  actorRef,
  onClickHandler,
}: {
  actorRef: ENCAActorRef
  onClickHandler: () => void
}) {
  const { substrate, channel, maxChIdx } = useSelector(actorRef, (state) => {
    const substrate =
      state.context.ENCA.executors[state.context.ENCA.curExecIdx].substrate
    return {
      substrate,
      channel: state.context.channel,
      maxChIdx: substrate.channels - 1,
    }
  })

  return (
    <div className='flex flex-col gap-2'>
      <div className='' onClick={onClickHandler}>
        <SubstrateRender
          substrate={substrate}
          channel={channel}
          className='w-50'
        />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <button
          className='cursor-pointer hover:border-white border rounded-full border-neutral-500 flex justify-center items-center size-7 disabled:opacity-30 disabled:cursor-not-allowed'
          onClick={() => actorRef.send({ type: 'channel.prev' })}
          disabled={maxChIdx <= 1}
        >
          <ChevronLeft size={14} />
        </button>
        <div className='text-neutral-400 text-xs min-w-[80px] text-center'>
          Channel Idx {channel} / {maxChIdx}
        </div>
        <button
          className='cursor-pointer hover:border-white border rounded-full border-neutral-500 flex justify-center items-center size-7 disabled:opacity-30 disabled:cursor-not-allowed'
          onClick={() => actorRef.send({ type: 'channel.next' })}
          disabled={maxChIdx <= 1}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function ColorRemappingPanel({
  actorRef,
  revertColors,
  setRevertColors,
}: {
  actorRef: ENCAActorRef
  revertColors: boolean
  setRevertColors: (value: boolean) => void
}) {
  const transform = useSelector(
    actorRef,
    (state) => state.context.ENCA.ensemble.transform,
    shallowEqual
  )

  // Ignore identity
  const colorMappings = transform
    ? transform.colMap
        .map((toColor, fromColor) => ({ fromColor, toColor }))
        .filter(({ fromColor, toColor }) => fromColor !== toColor)
    : []

  if (colorMappings.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col gap-2 border-t border-neutral-700 pt-4'>
      <div className='flex items-center justify-between'>
        <div className='text-neutral-400 text-xs'>Color remapping</div>
        <label className='flex items-center gap-2 cursor-pointer'>
          <span className='text-neutral-400 text-xs'>Revert</span>
          <div className='relative'>
            <input
              type='checkbox'
              checked={revertColors}
              onChange={(e) => setRevertColors(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </div>
        </label>
      </div>
      <div className='flex flex-wrap gap-2'>
        {colorMappings.map(({ fromColor, toColor }) => (
          <div
            key={`${fromColor}-${toColor}`}
            className='flex items-center gap-1.5 bg-neutral-900 rounded px-2 py-1'
          >
            <div
              className='size-4 rounded border border-neutral-600'
              style={{ backgroundColor: COLOR_MAP[fromColor] }}
              title={`Color ${fromColor}`}
            />
            <ArrowLeft size={12} className='text-neutral-500' />
            <div
              className='size-4 rounded border border-neutral-600'
              style={{ backgroundColor: COLOR_MAP[toColor] }}
              title={`Color ${toColor}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function ExecutorsList({ actorRef }: { actorRef: ENCAActorRef }) {
  const { curExecIdx, executors, playing } = useSelector(actorRef, (state) => ({
    curExecIdx: state.context.ENCA.curExecIdx,
    executors: state.context.ENCA.executors,
    playing: state.matches({ playback: 'playing' }),
  }))

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-3 text-xs px-2 pb-1'>
        <span className='text-neutral-500 font-mono w-3 text-center'>ID</span>
        <span className='text-neutral-500 font-mono w-8 text-center'>
          Steps
        </span>
        <span className='text-neutral-500 font-mono w-20'>Status</span>
      </div>
      <div className='flex flex-col gap-1.5'>
        {executors.map((executor, idx) => {
          const isActive = idx === curExecIdx
          const status = executor.reason
            ? executor.reason === 'max_steps'
              ? 'Max steps'
              : 'Converged'
            : isActive && playing
            ? 'Running'
            : 'Pending'
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs py-1.5 px-2 rounded ${
                isActive ? 'bg-neutral-700' : ''
              }`}
            >
              <span className='text-neutral-400 font-mono w-3 text-center'>
                {idx}
              </span>
              <span className='text-neutral-300 font-mono w-8 text-center'>
                {executor.steps}
              </span>
              <span
                className={`font-mono w-20 ${
                  !executor.reason && isActive
                    ? 'text-emerald-400'
                    : executor.reason === 'convergence'
                    ? 'text-blue-400'
                    : executor.reason === 'max_steps'
                    ? 'text-amber-400'
                    : 'text-neutral-500'
                }`}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PlaybackControls({ actorRef }: { actorRef: ENCAActorRef }) {
  const { playing, paused } = useSelector(
    actorRef,
    (state) => ({
      playing: state.matches({ playback: 'playing' }),
      paused: state.matches({ playback: 'paused' }),
    }),
    shallowEqual
  )

  const handlePlayPause = () => {
    if (paused) {
      actorRef.send({ type: 'play' })
    }
    if (playing) {
      actorRef.send({ type: 'pause' })
    }
  }

  return (
    <div className='border-t-0 sm:border-t border-neutral-700 pt-3 flex gap-2'>
      <button
        className='cursor-pointer hover:border-white border rounded-full border-neutral-500  flex justify-center items-center size-7'
        onClick={handlePlayPause}
      >
        {paused && <Play size={14} fill='white' className='' />}
        {playing && <Pause size={14} fill='white' className='' />}
      </button>
      <button
        className='cursor-pointer hover:border-white border rounded-full border-neutral-500  flex justify-center items-center size-7'
        onClick={() => actorRef.send({ type: 'reset' })}
      >
        <RotateCcw size={14} className='' />
      </button>
    </div>
  )
}

export function ENCA({
  taskId,
  testIdx = 0,
  caption,
}: {
  taskId: string
  testIdx?: number
  caption?: string
}) {
  const [revertColors, setRevertColors] = useState(true)

  const actorRef = useActorRef(machine, {
    input: {
      ENCA: ENCAClass.fromEnsembleGrid(
        (() => {
          const encaData = ENCAS[taskId]['test'][testIdx]
          const remapColors =
            encaData['transform_pipeline']['steps']?.[0]?.['RemapColors']
          return {
            taskId,
            ncas: ENCAS[taskId]['test'][testIdx]['ncas'].map((nca) => {
              return new NCA(nca.weights, nca.biases, nca.max_steps)
            }),
            transform:
              remapColors &&
              new RemapColors(remapColors.col_map, remapColors.rev_col_map),
          }
        })(),

        new Grid(ARC_DATA[taskId]['test'][testIdx]['input'])
      ),
    },
  })

  const { playing, paused } = useSelector(
    actorRef,
    (state) => ({
      playing: state.matches({ playback: 'playing' }),
      paused: state.matches({ playback: 'paused' }),
    }),
    shallowEqual
  )

  const handleClick = () => {
    if (paused) {
      actorRef.send({ type: 'play' })
    }
    if (playing) {
      actorRef.send({ type: 'pause' })
    }
  }

  return (
    <div className='w-min not-prose mx-auto'>
      <div className='flex gap-6 rounded-lg border border-neutral-700 bg-neutral-800 py-4 sm:py-6 p-6 overflow-x-auto w-min flex-col sm:flex-row'>
        <div className='flex flex-col gap-0 sm:gap-3 border-b sm:border-b-0 sm:border-l border-neutral-700 pb-3 sm:pb-0 sm:pl-6 order-1 sm:order-2'>
          <ExecutorsList actorRef={actorRef} />
          <PlaybackControls actorRef={actorRef} />
        </div>
        <div className='flex flex-col gap-4 order-2 sm:order-1'>
          <GridDisplay
            actorRef={actorRef}
            revertColors={revertColors}
            onClickHandler={handleClick}
          />
          <SubstrateDisplay actorRef={actorRef} onClickHandler={handleClick} />
          <ColorRemappingPanel
            actorRef={actorRef}
            revertColors={revertColors}
            setRevertColors={setRevertColors}
          />
        </div>
      </div>
      <div className='my-2 text-xs text-neutral-400 text-center'>
        {caption
          ? caption
          : `ENCA for ARC-AGI-1 puzzle #${taskId}. Test input ${testIdx}`}
      </div>
    </div>
  )
}

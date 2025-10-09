import type { Substrate } from '../classes/substrate'
import { COLOR_MAP } from '../constants'

export function SubstrateRender({
  substrate,
  channel,
  className = 'w-20',
}: {
  substrate: Substrate
  channel: number
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className='grid w-full bg-black'
        style={{
          gridTemplateColumns: `repeat(${substrate.width}, 1fr)`,
        }}
      >
        {[...new Array(substrate.height)].map((_, y) =>
          [...new Array(substrate.width)].map((_, x) => (
            <div
              key={`${y}-${x}`}
              className='border border-neutral-800 -m-[0.5px]'
              style={{
                aspectRatio: '1 / 1',
                backgroundColor: `${COLOR_MAP[5]}${Math.round(
                  Math.min(Math.max(0, substrate.get(y, x, channel)), 1) * 255
                )
                  .toString(16)
                  .padStart(2, '0')}`,
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

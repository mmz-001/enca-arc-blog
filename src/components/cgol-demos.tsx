import { CGoL } from './cgol'
import { BLOCK, BLINKER, GLIDER, PULSAR } from '../data/cgol-grids'

export function CGoLDemos() {
  return (
    <div className='flex flex-col sm:flex-row gap-6 rounded-lg border border-neutral-700 bg-neutral-800 p-6 items-center sm:items-end justify-between'>
      <CGoL title='Block' grid={BLOCK} />
      <CGoL title='Blinker' grid={BLINKER} />
      <CGoL title='Glider' grid={GLIDER} />
      <CGoL title='Pulsar' grid={PULSAR} />
    </div>
  )
}

import arch from '../assets/arch.svg'

export function ArchDiag() {
  return (
    <div className='flex flex-col not-prose gap-2 items-center'>
      <div className='w-full flex justify-center '>
        <img src={arch} alt='NCA Architecture' />
      </div>
      <div className='text-xs text-neutral-400'>
        Diagram showing one pass of the ENCA update step and its network.
      </div>
    </div>
  )
}

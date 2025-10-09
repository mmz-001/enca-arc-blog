import { AlertTriangle } from 'lucide-react'

export function PhotosensitivityWarning() {
  return (
    <div className='not-prose mb-4 sm:mb-6 rounded-lg border border-yellow-700 bg-yellow-900/20 p-2 sm:p-4 flex gap-3'>
      <AlertTriangle
        className='text-yellow-500 flex-shrink-0 hidden sm:block'
        size={20}
      />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <AlertTriangle
            className='text-yellow-500 flex-shrink-0 block sm:hidden'
            size={16}
          />
          <div className='font-medium text-yellow-200 text-xs sm:text-sm uppercase'>
            Photosensitivity Warning
          </div>
        </div>
        <div className='text-yellow-100/90 text-xs sm:text-sm'>
          The animations on this page contain flashing images and high contrast
          transitions that may cause discomfort or trigger seizures for people
          with photosensitive epilepsy.
        </div>
      </div>
    </div>
  )
}

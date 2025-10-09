import Blog from './blog.mdx'

function App() {
  return (
    <div className='bg-neutral-950 size-full py-2 md:py-16 px-2 overflow-x-hidden'>
      <Blog
        components={{
          wrapper({ ...props }) {
            return (
              <main
                className='prose prose-neutral prose-invert prose-sm mx-auto max-w-3xl'
                {...props}
              />
            )
          },
          h1({ ...props }) {
            return (
              <h1
                className='font-normal tracking-tight text-xl sm:text-3xl'
                {...props}
              ></h1>
            )
          },
          h2({ children, ...props }) {
            return (
              <h2
                {...props}
                className='font-normal tracking-tight text-lg sm:text-xl'
              >
                <div
                  aria-hidden='true'
                  className='inline-block mr-2.5 bg-[#00bc7d] rotate-45 size-3.5 mt-1 '
                />
                {children}
              </h2>
            )
          },
          h3({ ...props }) {
            return <h3 className='font-normal tracking-tight' {...props}></h3>
          },
        }}
      />
    </div>
  )
}

export default App

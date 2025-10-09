import { assign, fromCallback, setup } from 'xstate'
import { CGoL } from '../classes/cgol'

type CGoLEvent =
  | {
      type: 'play'
    }
  | {
      type: 'pause'
    }
  | {
      type: 'tick'
    }

type CGoLContext = {
  CGoL: CGoL
}

type CGoLInput = {
  CGoL: CGoL
}

export const CGoLMachine = setup({
  types: {} as {
    events: CGoLEvent
    context: CGoLContext
    input: CGoLInput
  },
  actors: {
    step: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: 'tick' })
      }, 150)
      return () => clearInterval(interval)
    }),
  },
}).createMachine({
  id: 'cgol-demo',
  initial: 'paused',
  context: ({ input }) => ({
    CGoL: input.CGoL,
  }),
  states: {
    paused: {
      on: {
        play: 'playing',
      },
    },
    playing: {
      on: {
        pause: 'paused',
        tick: {
          actions: assign({
            CGoL: ({ context }) => {
              context.CGoL.step()
              return context.CGoL
            },
          }),
        },
      },
      invoke: {
        src: 'step',
      },
    },
  },
})

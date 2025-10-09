import { assign, fromCallback, setup } from 'xstate'
import { ARCCAHC } from '../classes/arc-ca-hc'

type ARCCAHCEvent =
  | {
      type: 'play'
    }
  | {
      type: 'pause'
    }
  | {
      type: 'reset'
    }
  | {
      type: 'tick'
    }

type ARCCAHCContext = {
  ARCCAHC: ARCCAHC
  initialARCCAHC: ARCCAHC
}

type ARCCAHCInput = {
  ARCCAHC: ARCCAHC
}

export const ARCCAHCMachine = setup({
  types: {} as {
    events: ARCCAHCEvent
    context: ARCCAHCContext
    input: ARCCAHCInput
  },
  actors: {
    step: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: 'tick' })
      }, 300)
      return () => clearInterval(interval)
    }),
  },
}).createMachine({
  id: 'arccahc-demo',
  initial: 'paused',
  context: ({ input }) => ({
    ARCCAHC: input.ARCCAHC,
    initialARCCAHC: input.ARCCAHC.clone(),
  }),
  states: {
    paused: {
      on: {
        play: 'playing',
        reset: {
          actions: assign({
            ARCCAHC: ({ context }) => {
              return context.initialARCCAHC.clone()
            },
          }),
        },
      },
    },
    playing: {
      on: {
        pause: 'paused',
        reset: {
          actions: assign({
            ARCCAHC: ({ context }) => {
              return context.initialARCCAHC.clone()
            },
          }),
        },
        tick: {
          actions: assign({
            ARCCAHC: ({ context }) => {
              context.ARCCAHC.step()
              return context.ARCCAHC
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

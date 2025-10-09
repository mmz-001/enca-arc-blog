import { assign, fromCallback, setup } from 'xstate'
import { LinearNCA } from '../classes/linear-nca'
import type { Substrate } from '../classes/substrate'

type LinearNCAEvent =
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

type LinearNCAContext = {
  linearNCA: LinearNCA
  substrate: Substrate
  initialSubstrate: Substrate
}

type LinearNCAInput = {
  linearNCA: LinearNCA
  substrate: Substrate
}

export const LinearNCAMachine = setup({
  types: {} as {
    events: LinearNCAEvent
    context: LinearNCAContext
    input: LinearNCAInput
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
  id: 'LinearNCA',
  initial: 'paused',
  context: ({ input }) => ({
    ...input,
    initialSubstrate: input.substrate.clone(),
  }),
  states: {
    paused: {
      on: {
        play: 'playing',
        reset: {
          actions: assign(({ context }) => {
            return {
              substrate: context.initialSubstrate.clone(),
            }
          }),
        },
      },
    },
    playing: {
      on: {
        pause: 'paused',
        reset: {
          actions: assign(({ context }) => {
            return {
              substrate: context.initialSubstrate.clone(),
            }
          }),
        },
        tick: {
          actions: assign(({ context }) => {
            context.linearNCA.update(context.substrate)
            return {
              ...context,
            }
          }),
        },
      },
      invoke: {
        src: 'step',
      },
    },
  },
})

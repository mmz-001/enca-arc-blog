import { assign, fromCallback, setup } from 'xstate'
import { ENCA } from '../classes/executors'

type ENCAEvent =
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
  | {
      type: 'channel.prev'
    }
  | {
      type: 'channel.next'
    }
  | {
      type: 'channel.set'
      value: number
    }

type ENCAContext = {
  ENCA: ENCA
  initialENCA: ENCA
  channel: number
}

type ENCAInput = {
  ENCA: ENCA
}

export const ENCAMachine = setup({
  types: {} as {
    events: ENCAEvent
    context: ENCAContext
    input: ENCAInput
  },
  actors: {
    step: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: 'tick' })
      }, 100)
      return () => clearInterval(interval)
    }),
  },
}).createMachine({
  id: 'enca-demo',
  type: 'parallel',
  context: ({ input }) => ({
    ENCA: input.ENCA,
    initialENCA: input.ENCA.clone(),
    channel: input.ENCA.executors[0].substrate.channels - 1,
  }),
  states: {
    playback: {
      initial: 'paused',
      states: {
        paused: {
          on: {
            play: 'playing',
            reset: {
              actions: assign(({ context }) => ({
                ENCA: context.initialENCA.clone(),
              })),
            },
          },
        },
        playing: {
          on: {
            pause: 'paused',
            tick: {
              actions: assign({
                ENCA: ({ context }) => {
                  if (!context.ENCA.terminated) {
                    context.ENCA.step()
                  }
                  return context.ENCA
                },
              }),
            },
            reset: {
              actions: assign(({ context }) => ({
                ENCA: context.initialENCA.clone(),
              })),
            },
          },
          invoke: {
            src: 'step',
          },
        },
      },
    },
    channel: {
      initial: 'idle',
      states: {
        idle: {},
      },
      on: {
        'channel.prev': {
          actions: assign(({ context }) => {
            const total =
              context.ENCA.executors[context.ENCA.curExecIdx].substrate.channels
            return {
              channel: (context.channel - 1 + total) % total,
            }
          }),
        },
        'channel.next': {
          actions: assign(({ context }) => {
            const total =
              context.ENCA.executors[context.ENCA.curExecIdx].substrate.channels
            return {
              channel: (context.channel + 1) % total,
            }
          }),
        },
        'channel.set': {
          actions: assign(({ event, context }) => {
            const total =
              context.ENCA.executors[context.ENCA.curExecIdx].substrate.channels
            const value = Math.max(0, Math.min(event.value, total - 1))
            return { channel: value }
          }),
        },
      },
    },
  },
})

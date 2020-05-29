export const ioEvents = [
    'chat.messages.new',
    'chat.messages.typing',
    'chat.messages.broadcast.typing',
    'chat.messages.broadcast.new',
    'lobby.game.sessionStart',
    'lobby.game.broadcast.hit',
    'lobby.game.guess',
    'lobby.connected',
    'lobby.connect',
    'user.error',
] as const;

export type IoEvent = typeof ioEvents[number];

export const ioEvent = <E extends IoEvent>(e: E) => e;

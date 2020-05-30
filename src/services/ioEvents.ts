export const ioEvents = [
    'chat.messages.new',
    'chat.messages.typing',
    'chat.messages.broadcast.typing',
    'chat.messages.broadcast.new',
    'lobby.game.session_start',
    'lobby.game.broadcast.session_start',
    'lobby.game.broadcast.hit',
    'lobby.game.guess',
    'lobby.game.set_category',
    'lobby.game.broadcast.set_category',
    'lobby.connected',
    'lobby.connect',
    'user.error',
] as const;

export type IoEvent = typeof ioEvents[number];

export const ioEvent = <E extends IoEvent>(e: E) => e;

import { createContext } from 'react';

const EventContext = createContext<Function>(() => { /* Initially return nothing */ });
export const EventProvider = EventContext.Provider;
export const EventConsumer = EventContext.Consumer;
export { EventContext };

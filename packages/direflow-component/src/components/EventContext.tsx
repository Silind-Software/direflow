import { createContext } from 'react';

const EventContext = createContext<Function>(() => {});
export const EventProvider = EventContext.Provider;
export const EventConsumer = EventContext.Consumer;
export { EventContext };

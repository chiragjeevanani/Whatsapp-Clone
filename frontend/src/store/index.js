// Global state store placeholder (Zustand or basic reactive store state management)
// Once zustand package is added, this will export standard Zustand slices.

import { useState, useEffect } from "react";

// Simple custom listener-based store to avoid initial external dependencies
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const globalStore = new Store({
  currentUser: null,
  activeChatId: null,
  messages: [],
  onlineUsers: [],
});

export function useStoreSelector(selector) {
  const [selectedState, setSelectedState] = useState(() => selector(globalStore.getState()));

  useEffect(() => {
    return globalStore.subscribe((state) => {
      setSelectedState(selector(state));
    });
  }, [selector]);

  return selectedState;
}

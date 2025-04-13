export type EventMap = Record<string, any>
export type EventListener<T> = (payload: T) => void

export class EventEmitter<T extends EventMap> {
  #events = new Map<keyof T, Set<EventListener<any>>>()

  on<K extends keyof T>(event: K, listener: EventListener<T[K]>) {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Set())
    }
    this.#events.get(event)!.add(listener)
    return () => {
      this.off(event, listener)
    }
  }

  once<K extends keyof T>(event: K, listener: EventListener<T[K]>): () => void {
    const wrapper = (payload: T[K]): void => {
      this.off(event, wrapper)
      listener(payload)
    }
    return this.on(event, wrapper)
  }

  off<K extends keyof T>(event: K, listener: EventListener<T[K]>): void {
    this.#events.get(event)?.delete(listener)
    if (this.#events.get(event)?.size === 0) {
      this.#events.delete(event)
    }
  }

  emit<K extends keyof T>(event: K, payload?: T[K]): void {
    this.#events.get(event)?.forEach(listener => listener(payload))
  }

  clear<K extends keyof T>(event?: K): void {
    event ? this.#events.delete(event) : this.#events.clear()
  }
}

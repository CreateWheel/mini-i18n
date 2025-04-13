import { EventEmitter } from 'mini-i18n'
import { describe, expect, it, vi } from 'vitest'

interface TestEvents {
  foo: string
  bar: number
}

describe('event emitter', () => {
  it('should register and emit events with "on"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('foo', handler)
    emitter.emit('foo', 'hello')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('hello')
  })

  it('should call "once" listener only once', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.once('bar', handler)
    emitter.emit('bar', 42)
    emitter.emit('bar', 100)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(42)
  })

  it('should remove listener with "off"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('foo', handler)
    emitter.off('foo', handler)
    emitter.emit('foo', 'bye')

    expect(handler).not.toHaveBeenCalled()
  })

  it('should clear specific event listeners with "clear(event)"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('foo', handler)
    emitter.clear('foo')
    emitter.emit('foo', 'test')

    expect(handler).not.toHaveBeenCalled()
  })

  it('should clear all events with "clear()"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const fooHandler = vi.fn()
    const barHandler = vi.fn()

    emitter.on('foo', fooHandler)
    emitter.on('bar', barHandler)
    emitter.clear()

    emitter.emit('foo', 'a')
    emitter.emit('bar', 1)

    expect(fooHandler).not.toHaveBeenCalled()
    expect(barHandler).not.toHaveBeenCalled()
  })

  it('should allow the same listener to be added multiple times', () => {
    const emitter = new EventEmitter<TestEvents>()

    const handler = vi.fn()

    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('foo', handler)
    emitter.on('foo', handler)

    emitter.on('foo', handler1)
    emitter.on('foo', handler2)

    emitter.emit('foo', 'hello')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('should not throw when emitting an event with no listeners', () => {
    const emitter = new EventEmitter<TestEvents>()

    expect(() => {
      emitter.emit('foo', 'no listener')
    }).not.toThrow()
  })

  it('should not throw when removing a non-existent listener', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    expect(() => {
      emitter.off('bar', handler)
    }).not.toThrow()
  })

  it('should remove once listener before calling it', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn(() => {
      // The simulation handler adds the listener again
      emitter.on('foo', handler)
    })

    emitter.once('foo', handler)
    emitter.emit('foo', 'first')

    expect(handler).toHaveBeenCalledTimes(1)

    emitter.emit('foo', 'second')
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('should allow re-adding listener after clear', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('foo', handler)
    emitter.clear('foo')

    emitter.on('foo', handler)
    emitter.emit('foo', 'again')

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should return function to cancel listener in "on"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    const cancel = emitter.on('foo', handler)
    emitter.emit('foo', 'test')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('test')

    cancel() // Cancel the listener
    emitter.emit('foo', 'should not trigger')

    expect(handler).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should return function to cancel listener in "once"', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    const cancel = emitter.once('bar', handler)
    emitter.emit('bar', 42)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(42)

    cancel() // Cancel the listener
    emitter.emit('bar', 100)

    expect(handler).toHaveBeenCalledTimes(1) // Should not be called again
  })
})

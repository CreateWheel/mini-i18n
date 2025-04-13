import { I18n } from 'mini-i18n'
import { describe, expect, it, vi } from 'vitest'

describe('mini-i18n Events', () => {
  const languages = {
    EN: {
      greeting: {
        hello: 'Hello',
      },
    },
    ZH: {
      greeting: {
        hello: '你好',
      },
    },
  }

  it('should emit "language:changed" when changing language', () => {
    const i18n = new I18n({
      defaultLanguage: 'EN',
      languages,
    })

    const onChanged = vi.fn()
    i18n.on('language:changed', onChanged)

    i18n.setLanguage('ZH')

    expect(onChanged).toHaveBeenCalledTimes(1)
    expect(onChanged).toHaveBeenCalledWith({ language: 'ZH' })
  })

  it('should emit "language:added" when a new language is added', () => {
    const i18n = new I18n({
      defaultLanguage: 'EN',
      languages: { ...languages, FR: {} },
    })

    const onAdded = vi.fn()
    i18n.on('language:added', onAdded)

    i18n.addLanguage('FR', {
      greeting: {
        hello: 'Bonjour',
      },
    })

    expect(onAdded).toHaveBeenCalledTimes(1)
    expect(onAdded).toHaveBeenCalledWith({ language: 'FR' })
  })

  it('should emit "missingKey" when key is not found', () => {
    const i18n = new I18n({ defaultLanguage: 'EN', languages: { ...languages } })
    const fn = vi.fn()

    i18n.on('missingKey', fn)

    // @ts-expect-error not exist key
    const result = i18n.t('greeting.nonexistent', {
      defaultValue: 'default value',
      params: { name: 'Tom' },
    })

    expect(result).toBe('default value')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      key: 'greeting.nonexistent',
      options: {
        defaultValue: 'default value',
        params: { name: 'Tom' },
      },
    })
  })
})

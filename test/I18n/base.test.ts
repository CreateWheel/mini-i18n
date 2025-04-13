import { I18n } from 'mini-i18n'
import { beforeEach, describe, expect, it } from 'vitest'

const languages = {
  en: {
    hello: 'Hello',
    nested: {
      greeting: 'Hi, {name}!',
    },
  },
  zh: {
    hello: '你好',
    nested: {
      greeting: '你好, {name}!',
    },
  },
} as const

let i18n: I18n<typeof languages>

beforeEach(() => {
  i18n = new I18n({
    defaultLanguage: 'en',
    language: 'en',
    languages,
  })
})

describe('mini-i18n', () => {
  it('should return correct translation', () => {
    expect(i18n.t('hello')).toBe('Hello')
  })

  it('should support nested translation', () => {
    expect(i18n.t('nested.greeting', { params: { name: 'John' } })).toBe('Hi, John!')
  })

  it('should switch language', () => {
    i18n.setLanguage('zh')
    expect(i18n.getLanguage()).toBe('zh')
    expect(i18n.t('hello')).toBe('你好')
  })

  it('should interpolate variables', () => {
    i18n.setLanguage('zh')
    expect(i18n.t('nested.greeting', { params: { name: '小明' } })).toBe('你好, 小明!')
  })

  it('should return default value if key is missing', () => {
    // @ts-expect-error not.exist.key
    expect(i18n.t('not.exist.key', { defaultValue: 'Default Text' })).toBe('Default Text')
  })

  it('should add a new language dynamically', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        ...languages,
        jp: {},
      },
    })
    i18n.addLanguage('jp', {
      hello: 'こんにちは',
    })
    i18n.setLanguage('jp')
    expect(i18n.t('hello')).toBe('こんにちは')
  })

  it('should clear cache correctly', () => {
    i18n.t('hello') // build cache
    i18n.clearCache()
    // test again to make sure no errors and returns correct result
    expect(i18n.t('hello')).toBe('Hello')
  })

  it('should switch and get current language', () => {
    const i18n = new I18n({ defaultLanguage: 'en', language: 'en', languages })
    expect(i18n.getLanguage()).toBe('en')
    i18n.setLanguage('zh')
    expect(i18n.getLanguage()).toBe('zh')
  })

  it('should interpolate with custom delimiters', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: { en: { greet: 'Hi <<name>>!' } },
      interpolation: { prefix: '<<', suffix: '>>' },
    })

    expect(i18n.t('greet', { params: { name: 'Lete' } })).toBe('Hi Lete!')
  })

  it('should clear internal cache and re-compute', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: { en: { msg: 'hello' }, zh: { msg: '你好' } },
    })

    i18n.t('msg') // => cached: "hello"
    i18n.setLanguage('zh')
    expect(i18n.t('msg')).toBe('你好')

    i18n.setLanguage('en')
    i18n.clearCache()
    expect(i18n.t('msg')).toBe('hello') // should still work after clearing
  })

  it('should fallback to defaultValue if key not found', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: { en: {} },
    })

    // @ts-expect-error not.exist
    expect(i18n.t('not.exist', { defaultValue: 'fallback' })).toBe('fallback')
  })

  it('should return key itself if path not found and no defaultValue', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: { en: { a: { b: { c: 'value' } } } },
    })

    // @ts-expect-error a.b.x
    expect(i18n.t('a.b.x')).toBe('a.b.x')
  })

  it('should interpolate deeply nested value', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          user: {
            profile: {
              welcome: 'Welcome, {name}!',
            },
          },
        },
      },
    })

    expect(i18n.t('user.profile.welcome', { params: { name: 'Tom' } })).toBe('Welcome, Tom!')
  })

  it('should handle missing params gracefully', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          greet: 'Hello, {name}!',
        },
      },
    })

    expect(i18n.t('greet')).toBe('Hello, {name}!')
  })

  it('should interpolate numbers or booleans correctly', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          result: 'Score: {score}, Passed: {pass}',
        },
      },
    })

    expect(i18n.t('result', { params: { score: 95, pass: true } })).toBe('Score: 95, Passed: true')
  })

  it('should return updated value after language switch', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: { title: 'Title' },
        fr: { title: 'Titre' },
      },
    })

    expect(i18n.t('title')).toBe('Title')
    i18n.setLanguage('fr')
    expect(i18n.t('title')).toBe('Titre')
  })

  it('should not replace placeholder if param is not provided', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          test: 'Value: {missing}',
        },
      },
    })

    expect(i18n.t('test')).toBe('Value: {missing}')
  })

  it('should replace correct param and keep unmatched intact', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          test: 'Hello, {name}, aka {nickname}',
        },
      },
    })

    expect(i18n.t('test', { params: { name: 'John' } })).toBe('Hello, John, aka {nickname}')
  })

  it('should fallback to default language if selected language not found', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: { key: 'Default' },
      },
    })

    // @ts-expect-error not exists
    i18n.setLanguage('de') // not exists
    expect(i18n.t('key')).toBe('Default')
  })

  it('should return key if both current and fallback language missing key', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {},
      },
    })

    // @ts-expect-error not exists
    i18n.setLanguage('zh') // zh not exists
    // @ts-expect-error not exists
    expect(i18n.t('missing.key')).toBe('missing.key')
  })

  it('should return key when language object is empty', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {},
      },
    })

    // @ts-expect-error not exists
    expect(i18n.t('abc')).toBe('abc')
  })

  it('should interpolate even if param value contains special chars', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          greet: 'Hello, {name}!',
        },
      },
    })

    expect(i18n.t('greet', { params: { name: '<Tom & Jerry>' } })).toBe('Hello, <Tom & Jerry>!')
  })

  it('should use defaultLanguage if no language provided', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      languages: {
        en: { msg: 'Hi' },
      },
    })

    expect(i18n.t('msg')).toBe('Hi')
  })

  it('should interpolate multiple params correctly', () => {
    const i18n = new I18n({
      defaultLanguage: 'en',
      language: 'en',
      languages: {
        en: {
          status: '{name} has {count} messages',
        },
      },
    })

    expect(i18n.t('status', { params: { name: 'Alice', count: 5 } })).toBe('Alice has 5 messages')
  })
})

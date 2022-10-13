import assert from 'assert'
import { describe, it } from 'mocha'
import { init, use, setLanguage, getLanguage } from '../dist/main.mjs'

const options = {
  lang: 'zh',
  languages: {
    zh: { hello: '你好', languages: [{ js: ['ts', 'nodejs'] }, 'java', 'c#'] },
    en: { hello: 'hello', languages: [{ js: ['ts', 'nodejs'] }, 'java', 'c#'] }
  }
}

describe('mini-i18n', () => {
  it('init() No parameters are passed', () => {
    assert.equal(typeof init(), 'function')
  })

  it('use() No parameters are passed', () => {
    init(options)
    assert.equal(use(), 'zh')
  })

  it('use() Change language', () => {
    init(options)
    assert.equal(use('en'), 'en')
  })

  it('setLanguage() Pass in the wrong language type', () => {
    let errorParamType
    let errorNoObject
    try {
      setLanguage(123, {})
    } catch (error) {
      errorParamType = error.message
    }
    try {
      setLanguage('123', [])
    } catch (error) {
      errorNoObject = error.message
    }

    assert.ok(
      errorParamType === '"lang" parameter must be a string' &&
        errorNoObject === '"language" parameter must be a object'
    )
  })

  it('getLanguage()', () => {
    init(options)
    assert.equal(JSON.stringify(getLanguage()), JSON.stringify(options.languages))
  })

  it('i18n()', () => {
    const t = init(options)
    use('zh')
    assert.equal(t('languages[0].js[1]'), 'nodejs')
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullish = (v: any, vv: any) => (null == v ? vv : v)

type KV = {
  [key: string]: number | string | boolean | [] | {}
}

let languages: KV
let useLang: string

function paramTypeErrorHandler(param: string, type: string) {
  throw new Error(`"${param}" parameter must be a ${type}`)
}

function isObject(param: KV) {
  return Object.prototype.toString.call(param) === '[object Object]'
}

function i18n(key: string) {
  key = key.replace(/\[(\w+)\]/g, '.$1') // Handle array subscripts
  const arr = key.split('.')
  let obj = { ...(languages[useLang] as KV) }
  for (let i = 0; i < arr.length; i++) obj = nullish(obj[arr[i]], null)

  return obj
}

type options = {
  lang?: string
  languages?: KV
}
// eslint-disable-next-line no-unused-vars
export function init(options: options): (key: string, params: KV) => KV {
  if (!isObject(options)) options = {}
  if (typeof options.lang === 'string') useLang = options.lang
  languages = options.languages || {}
  if (!isObject(languages)) paramTypeErrorHandler('"languages"', 'object')

  return i18n
}

export function use(lang?: string) {
  if (lang && !languages[lang]) {
    // eslint-disable-next-line no-console
    console.warn(`Language switch failed, the current language is "${useLang}"`)
    return useLang
  }
  return (useLang = nullish(lang, useLang))
}

export function setLanguage(lang: string, language: KV) {
  if (typeof lang !== 'string') paramTypeErrorHandler('lang', 'string')
  if (!isObject(language)) paramTypeErrorHandler('language', 'object')
  languages = Object.assign({}, languages, { [lang]: language })
}

export function getLanguage() {
  return languages
}

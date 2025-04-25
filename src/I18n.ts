import { EventEmitter } from './EventEmitter'

export type ObjectKeyPaths<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends () => void
          ? never
          : T[K] extends Record<string, any>
            ? ObjectKeyPaths<T[K], `${P}${K}.`>
            : `${P}${K}`
        : never
    }[keyof T]
  : never

export interface IOptions<T extends Record<string, object>> {
  defaultLanguage: keyof T
  language?: keyof T
  languages: T
  interpolation?: IInterpolation
}

export interface IInterpolation {
  prefix: string
  suffix: string
}

export interface ITOptions {
  defaultValue?: string
  params?: Record<string, any>
}

export interface I18nEvents<T> {
  'language:added': { language: keyof T }
  'language:changed': { language: keyof T }
  'missingKey': { key: string, options?: ITOptions }
}

export class I18n<T extends Record<string, object>> extends EventEmitter<I18nEvents<T>> {
  #defaultLanguage: keyof T
  #language: keyof T
  #languages: T
  #interpolation: IInterpolation
  #interpolationRegExp: RegExp
  #cache: Map<string, string>

  constructor(options: IOptions<T>) {
    super()
    this.#defaultLanguage = options.defaultLanguage
    this.#language = options.language || options.defaultLanguage
    this.#languages = options.languages
    this.#interpolation = options.interpolation || { prefix: '{', suffix: '}' }
    this.#interpolationRegExp = this.#initInterpolationRegExp()
    this.#cache = new Map()
  }

  t<Path extends string & ObjectKeyPaths<T[keyof T]>>(key: Path, options?: ITOptions): string {
    const cacheValue = this.#cache.get(key)
    if (cacheValue) {
      return cacheValue
    }

    let value = this.#getValue(key)

    if (!value) {
      this.emit('missingKey', { key, options })
      if (options?.defaultValue) {
        return options.defaultValue
      }
      value = this.#getValue(key, this.#defaultLanguage)
    }

    if (value && options?.params) {
      value = this.#handleInterpolation(value, options.params)
    }

    value = value ?? key

    this.#cache.set(key, value)

    return value
  }

  clearCache(): void {
    this.#cache.clear()
  }

  getLanguage(): keyof T {
    return this.#language
  }

  setLanguage<L extends keyof T>(language: L): void {
    this.emit('language:changed', { language })
    this.clearCache()
    this.#language = language
  }

  addLanguage(language: keyof T, languageData: T[keyof T]): void {
    this.#languages[language] = languageData
    this.emit('language:added', { language })
  }

  #getValue(key: string, language?: keyof T): string | null {
    const parts = key.split('.')

    let result: any = this.#languages[language || this.#language]
    for (const part of parts) {
      result = result?.[part]
      if (result === undefined)
        break
    }
    return result
  }

  #initInterpolationRegExp(): RegExp {
    const prefix = this.#interpolation.prefix
    const suffix = this.#interpolation.suffix
    const pattern = String.raw`${prefix}(\w+)${suffix}`
    return new RegExp(pattern, 'g')
  }

  #handleInterpolation(value: string, params: ITOptions['params']): string {
    return value.replace(this.#interpolationRegExp, (match, key) => params?.[key] ?? match)
  }
}

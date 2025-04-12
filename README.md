# mini-i18n

[![visitors][visitors-src]][visitors-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

🌍 **A lightweight internationalization (i18n) module** for browser and Node.js environments, with a size of only ~2KB!

## ✨ Features

- ✅ Zero dependencies, ultra-lightweight
- 📦 Supports nested access (e.g., `settings.theme.light`)
- 🔄 Supports string interpolation (`Hello, {name}`)
- 🌐 Dynamic language switching
- ➕ Dynamic language addition
- ⚡ Internal caching mechanism for better performance

## 🔧 Type Support

Built-in type inference support for IDE smart hints.

```ts
type ObjectKeyPaths<T, P extends string = ''> = // Automatically generates language key path types
```

## 📦 Installation

```bash
npm install mini-i18n
```

## 🚀 Usage Example

```ts
import { I18n } from 'mini-i18n'

const languages = {
  en: {
    settings: {
      title: 'Settings',
      theme: { light: 'Light', dark: 'Dark' },
      tags: ['a', 'b'],
    },
    greeting: 'Hello, {name}!',
  },
  zh: {
    settings: {
      title: '设置',
      theme: { light: '浅色', dark: '深色' },
      tags: ['甲', '乙'],
    },
    greeting: '你好, {name}!',
  },
  // 🔁 If you plan to add new languages later (e.g., 'jp'), you can define an empty object in advance to avoid TS errors
  jp: {} // TIP: Define placeholder objects in advance
} as const // If using TypeScript, it's recommended to add `as const`

const i18n = new I18n({
  defaultLanguage: 'en',
  language: 'en',
  languages,
})

// Get translations
i18n.t('settings.title') // => "Settings"
i18n.t('settings.tags.0') // => "a"

i18n.setLanguage('zh')
i18n.t('settings.title') // => "设置"

// Using interpolation
i18n.t('greeting', { params: { name: 'Lete' } }) // => "你好, Lete!"
```

## ⚙️ Configuration Options

### `new I18n(options)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `defaultLanguage` | `keyof T` | The default language |
| `language` | `keyof T` | The current language |
| `languages` | `Record<string, object>` | The collection of language data |
| `interpolation` _(optional)_ | `{ prefix: string; suffix: string }` | The prefix and suffix for interpolation placeholders (default: `{}`) |

## 🧩 API

### `t(key: string, options?: { params?: object, defaultValue?: string })`

Gets the translation content, supports nested access and interpolation.

```ts
i18n.t('settings.theme.light') // => "浅色"
i18n.t('greeting', { params: { name: 'World' } }) // => "你好, World!"
i18n.t('unknown.key', { defaultValue: 'Not found' }) // => "Not found"
```

### `setLanguage(language: keyof T)`

Sets the specified language and clears the cache.

### `getLanguage(): keyof T`

Gets the current language.

### `addLanguage(language: keyof T, languageData: T[keyof T])`

Dynamically adds a new language package.

### `clearCache()`

Clears the translation cache.

## 📄 License

[MIT](./LICENSE) License © [Lete114](https://github.com/lete114)

<!-- Badges -->

[visitors-src]: https://visitor-badge.imlete.cn/?id=github.CreateWheel.mini-i18n&labelColor=080f12&color=1fa669&type=pv&style=flat
[visitors-href]: https://github.com/Lete114/visitor-badge

[npm-version-src]: https://img.shields.io/npm/v/mini-i18n?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/mini-i18n

[npm-downloads-src]: https://img.shields.io/npm/dm/mini-i18n?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/mini-i18n

[bundle-src]: https://img.shields.io/bundlephobia/minzip/mini-i18n?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=mini-i18n

[license-src]: https://img.shields.io/github/license/CreateWheel/mini-i18n.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/CreateWheel/mini-i18n/blob/main/LICENSE

[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/mini-i18n

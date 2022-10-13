# mini-i18n

Lightweight the internationalization module, Can be run in browser or nodejs environment, only 1kb

## Installation

```bash
npm install mini-i18n
```

## Usage

```js
import I18n from 'mini-i18n'

const options = {
  lang: 'zh', // default language
  languages: {
    // list of languages
    zh: { hello: '你好', languages: [{ js: ['ts', 'nodejs'] }, 'java', 'c#'] }
  }
}

// Initialize and return a translation method
const t = I18n.init(options)

console.log('hello:', t('hello')) // hello: 你好

// Adding new languages to the language list
I18n.setLanguage('en', { hello: 'hello', languages: [{ js: ['ts', 'nodejs'] }, 'java', 'c#'] })

// View the list of languages
console.log('list of languages:', I18n.getLanguage())
// {
//   zh: {
//     hello: "你好",
//     languages: [{ "js": ["ts", "nodejs"] }, "java", "c#"]
//   },
//   en: {
//     hello: "hello",
//     languages: [{ "js": ["ts", "nodejs"] }, "java", "c#"]
//   }
// }

// Switching languages
I18n.use('en')

console.log('hello:', t('hello')) // hello: hello

// Switching zh
I18n.use('zh')

console.log('hello:', t('hello')) // hello: 你好

// can be obtained by subscripting the array
console.log('array index:', t('languages[0].js[1]')) // array index: nodejs

// See which language is currently in use
console.log('current use language:', I18n.use()) // current use language: zh

// How do you change dynamically?

// For example, the hello above has it output hello, world
// Custom Add Placeholder
I18n.setLanguage('en-test', { hello: 'hello$[placeholder]', languages: [{ js: ['ts', 'nodejs'] }, 'java', 'c#'] })

I18n.use('en-test')

// By using the replace method of the string
const hello = t('hello').replace('$[placeholder]', ', world')
console.log('en-test:', hello) // en-test: hello, world
```

import { I18n } from 'mini-i18n'
import { beforeEach, describe, expect, it } from 'vitest'

const languages = {
  en: {
    tags: ['News', 'Tech', 'Sports'],
    users: [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ],
    nested: {
      list: [
        { label: 'Item A' },
        { label: 'Item B' },
      ],
    },
    message: '{name} is {age} years old',
  },
  zh: {
    tags: ['新闻', '科技', '体育'],
    users: [
      { name: '小红', age: 25 },
      { name: '小明', age: 30 },
    ],
    nested: {
      list: [
        { label: '项目A' },
        { label: '项目B' },
      ],
    },
    message: '{name} 今年 {age} 岁',
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

describe('mini-i18n - arrays and complex structures', () => {
  it('should translate array elements by index', () => {
    expect(i18n.t('tags.0')).toBe('News')
    expect(i18n.t('tags.2')).toBe('Sports')
    i18n.setLanguage('zh')
    expect(i18n.t('tags.0')).toBe('新闻')
  })

  it('should access array of objects', () => {
    expect(i18n.t('users.1.name')).toBe('Bob')
    i18n.setLanguage('zh')
    expect(i18n.t('users.1.name')).toBe('小明')
  })

  it('should access nested array object values', () => {
    expect(i18n.t('nested.list.0.label')).toBe('Item A')
    i18n.setLanguage('zh')
    expect(i18n.t('nested.list.1.label')).toBe('项目B')
  })

  it('should support interpolation with array object fields', () => {
    const user = i18n.t('message', {
      params: {
        name: i18n.t('users.0.name'),
        age: i18n.t('users.0.age'),
      },
    })
    expect(user).toBe('Alice is 25 years old')

    i18n.setLanguage('zh')
    const zhUser = i18n.t('message', {
      params: {
        name: i18n.t('users.0.name'),
        age: i18n.t('users.0.age'),
      },
    })
    expect(zhUser).toBe('小红 今年 25 岁')
  })
})

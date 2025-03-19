import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'],
  },
})

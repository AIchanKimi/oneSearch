import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'],
    'react-refresh/only-export-components': ['off'],
  },
})

import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ["public/**/*.*", "vendor/**/*.*", "*.js"],
    rules: {
      quotes: ['error', 'single'],
      indent: ['error', 2],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
    },
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: true,
        extraFileExtensions: ['.vue'],
      },
    },
  }
]
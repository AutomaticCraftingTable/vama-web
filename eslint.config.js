import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ["public/**/*.*", "vendor/**/*.*", "*.js"],
    rules: {
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
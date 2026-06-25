const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');
const jestDomPlugin = require('eslint-plugin-jest-dom');
const prettierPlugin = require('eslint-plugin-prettier');
const promisePlugin = require('eslint-plugin-promise');
const sonarjsPlugin = require('eslint-plugin-sonarjs');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { project: 'tsconfig.json', tsconfigRootDir: __dirname, sourceType: 'module' },
      globals: { ...require('globals').node, ...require('globals').jest },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      jest: jestPlugin,
      'jest-dom': jestDomPlugin,
      prettier: prettierPlugin,
      promise: promisePlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      ...sonarjsPlugin.configs['recommended-legacy'].rules,
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
      ...importPlugin.configs.typescript.rules,
      ...jestPlugin.configs.recommended.rules,
      ...jestDomPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,

      // Custom rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': ['error'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      // sonarQube rules
      // not in eslint:recomended, turn all rules to "error" eventually
      'block-scoped-var': 'error',
      curly: 'error',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'handle-callback-err': 'error',
      'no-alert': 'error',
      'no-await-in-loop': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-constructor-return': 'error',
      'no-continue': 'error',
      'no-div-regex': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-restricted-properties': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'require-await': 'error',
      'wrap-iife': 'error',

      // stylistic
      camelcase: 'warn',
      'consistent-this': ['warn', 'that'],
      'eol-last': 'warn',
      'func-name-matching': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'max-depth': 'warn',
      'no-else-return': 'warn',
      'no-lonely-if': 'error',
      'no-multi-assign': 'warn',
      'no-new-object': 'warn',
      'no-underscore-dangle': 'warn',
      'no-unneeded-ternary': 'warn',
      'one-var': ['warn', 'never'],
      'operator-assignment': 'warn',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['class', 'function'] },
        { blankLine: 'always', prev: ['class', 'function'], next: '*' },
      ],

      // es2015
      'no-duplicate-imports': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'prefer-numeric-literals': 'warn',

      // override @typescript-eslint/eslint-recommended
      'no-unused-vars': 'off',
      'no-array-constructor': 'off',
      'no-extra-semi': 'off',
      'prefer-rest-params': 'warn',
      'prefer-spread': 'warn',

      // @typescript-eslint
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],

      // import
      // 'import/extensions': ['error', 'never', { json: 'always', md: 'always' }],
      'import/first': 'error',
      // 'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-unresolved': 'error',
      // 'import/no-amd': 'error',
      'import/no-deprecated': 'error',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-named-default': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

      // promise
      'promise/catch-or-return': ['warn', { allowThen: true }],
      'promise/no-return-wrap': ['error', { allowReject: true }],
      'promise/always-return': 'off',
      'promise/avoid-new': 'off',

      // jest
      // override recomended
      'jest/no-disabled-tests': 'error',
      'jest/no-commented-out-tests': 'error',
      'jest/no-jasmine-globals': 'warn',

      // not in recomended
      'jest/no-restricted-matchers': ['error', { toBeTruthy: 'Avoid `toBeTruthy`', toBeFalsy: 'Avoid `toBeFalsy`' }],
      'jest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      'jest/no-duplicate-hooks': 'error',
      'jest/prefer-equality-matcher': 'error',
      'jest/prefer-comparison-matcher': 'error',

      'jest/no-conditional-in-test': 'warn',
      'jest/no-large-snapshots': ['off', { maxSize: 50 }], // would be great to activate at some point
    },
    settings: {
      'import/ignore': ['node_modules'],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json', // Ensure this points to your tsconfig.json
        },
      },
    },
  },
  { ignores: ['.eslintrc.js', 'app.*.ts', 'main.ts', 'src/migration/*', 'node_modules', 'build', 'dist', 'coverage', '.scannerwork', 'test/**'] },
];

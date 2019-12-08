module.exports = {
  extends: 'sora/vue',
  plugins: ['markdown'],

  env: {
    node: true,
  },

  rules: {
    semi: 0,
    indent: ['error', 2, { 'SwitchCase': 1 }],

    'vue/html-indent': ['error', 2],
    'vue/html-quotes': ['error', 'single'],
  },
}

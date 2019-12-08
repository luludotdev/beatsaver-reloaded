/**
 * @param {string} title Sidebar Title
 * @param {string[]} routes Routes
 * @param {boolean} [collapsable] Collapsible Title
 * @returns {{}}
 */
function generateSidebar(title, routes, collapsable = false) {
  return [{
    title,
    collapsable,
    children: routes,
  }]
}

module.exports = {
  title: 'BeatSaver Reloaded',

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],

  theme: 'yuu',
  themeConfig: {
    yuu: {
      defaultColorTheme: 'blue',
    },

    repo: 'lolPants/beatsaver-reloaded',
    docsDir: 'docs/content',
    editLinks: true,
    editLinkText: 'Help improve this page!',
    lastUpdated: 'Last Updated',

    displayAllHeaders: true,
    sidebar: {
      '/endpoints/': generateSidebar('Endpoints', [
        '',
        'maps',
        'search',
        'vote',
        'download',
        'dump',
        'auth',
        'users',
      ]),
      '/responses/': generateSidebar('Responses', [
        '',
        'pagination',
        'beatmap',
        'user',
      ]),
      '/usage/': generateSidebar('Usage', [
        '',
        'semantics',
        'errors',
        'rate-limits',
      ]),
    },

    nav: [
      { text: 'Usage', link: '/usage/' },
      { text: 'Endpoints', link: '/endpoints/' },
      { text: 'Responses', link: '/responses/' },
    ],
  },
  plugins: [
    ['@vuepress/last-updated', {
      transformer: timestamp => {
        const dateformat = require('dateformat')
        return dateformat(timestamp, 'yyyy/mm/dd hh:MM:ss TT')
      },
    }],
    ['@vuepress/medium-zoom', {
      options: {
        margin: 8,
        background: '#21253073',
      },
    }],
    '@vuepress/nprogress',
    ['container', {
      type: 'feature',
      before: info => `<div class="feature"><h2>${info}</h2>`,
      after: '</div>',
    }],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': '../',
      },
    },
  },
}

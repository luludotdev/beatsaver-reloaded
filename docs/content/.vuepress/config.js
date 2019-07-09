module.exports = {
  title: 'BeatSaver Reloaded',

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],

  theme: 'yuu',
  themeConfig: {
    yuu: {
			colorThemes: ['blue', 'red'],
    },

    repo: 'lolPants/beatsaver-reloaded',
    docsDir: 'docs/content',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
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
  configureWebpack: {
		resolve: {
			alias: {
				'@': '../',
			},
		},
	},
}

function generateSidebar(title, routes) {
  return [{
    title,
    collapsable: false,
    children: routes,
  }]
}

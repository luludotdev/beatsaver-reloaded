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
    sidebar: 'auto',
    nav: [
      { text: 'Home', link: '/' },
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

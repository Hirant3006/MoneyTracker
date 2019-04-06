const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'spa',

  head: {
    title: 'Money tracker',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  router: {
    middleware: 'router-auth'
  },
  loading: { color: '#fff' },

  css: [
    '~/assets/style/app.styl',
    // { src: '~/assets/css/common.scss', lang: 'scss' },


  ],
  plugins: [
    { src: '@/plugins/vuetify' },
    '~/plugins/fireauth.js'

  ],

  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
  },

  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ["~assets/style/variables.styl"]
      }
    },
    extend(config, ctx) {

    }
  },
  vendor: [
    'firebase',
    'vuetify'
  ]
}

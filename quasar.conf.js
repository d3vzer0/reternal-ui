module.exports = function (ctx) {
  return {
    boot: [
      'axios',
      'mixins',
      'auth',
      'socketio'
    ],
    css: [
      'app.scss'
    ],
    extras: [
      'fontawesome-v5',
      'mdi-v5',
      'roboto-font',
      'material-icons'
    ],

    framework: {
      config: {
        dark: 'auto'
      },
      iconSet: 'material-icons',
      lang: 'en-us',
      all: 'auto',
      components: [],
      directives: [],
      plugins: []
    },
    supportIE: false,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history', // available values: 'hash', 'history'
      showProgress: true,
      gzip: false,
      analyze: false,

      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    devServer: {
      https: true,
      host: '127.0.0.1',
      port: 9090,
      open: false,
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/socket.io': {
          target: 'http://api:5000/socket.io',
          changeOrigin: true,
          pathRewrite: {
            '^/socket.io': ''
          }
        },
        '/api/v1': {
          target: 'http://api:5000/api/v1',
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1': ''
          }
        }
      }
    },

    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'Reternal',
        short_name: 'Reternal',
        description: 'Reternal UI',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: ''
    },
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      bundler: 'packager',
      packager: {
      },

      builder: {
        appId: 'reternal'
      },
      nodeIntegration: true,
      extendWebpack (cfg) {
      }
    }
  }
}

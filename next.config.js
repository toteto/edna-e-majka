const { PHASE_PRODUCTION_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  const isProductionServer = phase === PHASE_PRODUCTION_SERVER
  return {
    ...defaultConfig,
    env: Object.assign(defaultConfig.env || {}, {
      publicDirPath: isProductionServer ? '' : process.cwd() + '/public'
    }),
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty' // https://github.com/vercel/next.js/issues/7755
        }
      }

      return config
    }
  }
}

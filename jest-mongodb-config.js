// https://www.npmjs.com/package/@shelf/jest-mongodb

module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        version: '4.0.3',
        skipMD5: true,
      },
      autoStart: false,
      instance: {},
    },
    mongoURLEnvName: 'DB_CONNECTION_STRING',
  };
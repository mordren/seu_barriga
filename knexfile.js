module.exports = {
    test: {
      client: 'pg',
      version: '11',
      connection: {
        host: 'motty.db.elephantsql.com',
        user: 'zmzdcpqk',
        password: 'YwPD7wj3r1DOjlc_NLI-tgCbG54M5cwB',
        database: 'zmzdcpqk',
      },
      migrations: { directory: './src/migrations' },
      seeds: { directory: './src/seeds' },
    },
    prod: {
      client: 'pg',
      version: '11',
      connection: {
        host: 'motty.db.elephantsql.com',
        user: 'zmzdcpqk',
        password: 'YwPD7wj3r1DOjlc_NLI-tgCbG54M5cwB',
        database: 'zmzdcpqk',
      },
      migrations: { directory: './src/migrations' },
    },
  };
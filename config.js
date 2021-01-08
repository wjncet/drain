module.exports = {



    // postgreSQL URL
    databaseURL: process.env.DATABASE_URL
        || "postgres://postgres:postgres@127.0.0.1:5432/postgres"
    ,
    dbPool: {
      max: parseInt(process.env.DBPOOL_MAX) || 50,
      connectionTimeoutMillis: parseInt(process.env.DBPOOL_CONNECTION_TIMEOUT_MILLIS) || 0,
      idleTimeoutMillis: parseInt(process.env.DBPOOL_IDLE_TIMEOUT_MILLIS) || 10000,
    }

};

const express = require('express')
const pg = require('pg');
const NodeCache = require('node-cache');
const ip = require('ip');
const hash = require('crypto').createHash('sha256');
var path = require('path');
const env = require('dotenv').config();



const app = express()
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html

const pool = new pg.Pool({
  user: env.parsed.PGUSER,
  host: env.parsed.PGHOST,
  database: env.parsed.PGDATABASE,
  password: env.parsed.PGPASSWORD,
  port: env.parsed.PGPORT
});


/// -------------------- RATE LIMITERS MIDDLEWARE -----------------------------

// TESTED RATE LIMITER ON:
// EDGE, FIREFOX, CHROME, 
// CURL, POSTMAN, AND WGET 
// AND DIGITAL OCEAN Functions. 

 const refreshRATE = 60;
 const cache = new NodeCache({ stdTTL: refreshRATE, checkperiod: refreshRATE });
 const LongCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: refreshRATE });
 const currentIp = ip.address();
 const LIMIT = 60;

 // THIS WILL LOOK AT THE HEADER AND VERIFY THE CLIENT SIGNATURE,
 // NORMALLY THIS WOULD BE LOOKED UP, IN DB AND COMPARED FOR A MATCH 
 // SUCH AS SELECT * FROM CLIENTS WHERE SIGNATURE = 'SIGNATURE'
 // AND IF MATCHED, THE QUERY IS EXECUTED, ELSE IT IS DENIED.

 const signature = hash.update(currentIp).digest('hex');


 // if the client goes over the rate limit 10 times over a 24 hour period,
 // the client will be blocked for 24 hours.
 const BLOCKPOOL = 10;
 let BLOCKTRIGGER = 0;


 /**
  * @function: isClientBlocked
  *
  * 
  * @description: check if the block exceeds our set amount of requests
  *
  */

 const isClientBlocked = () => {
  const current = LongCache.get(currentIp);
  if (current >= BLOCKPOOL) {
    return true;
  }
  return false;
}

/**
 * 
 *  @function: increaseBlockPool
 * 
 *  @description: inorder to increase the daily block pool, if user goes over the rate limit n times,
 *                all requests will be blocked for 24 hours.
 * 
 */

 const increaseBlockPool = () => {
   BLOCKTRIGGER = 1;
   let current = LongCache.get(currentIp);
   // check if the ip address exists in the cache
    if (current < BLOCKPOOL) {
      LongCache.set(currentIp, current + 1);
    }
 }


/**
 * 
 *  @function: verifyRateLimit 
 * 
 *  @description:  this is the rate limiter function that will be used to verify the rate limit
 * 
 */

const verifyRateLimit = (req, res, next) => {
  const current = cache.get(currentIp);

  if (current < LIMIT) {
    cache.set(currentIp, current + 1);
    BLOCKTRIGGER = 0;
    return next();
  }

  if (BLOCKTRIGGER === 0) {
    increaseBlockPool();
  }
  return res.status(429).send('Too Many Requests');
}


/**
 * 
 *  @function: verifyRequestHeaders
 * 
 *  @description: this function is used to verify the request headers 
 *                before allowing any requests to be made to the api
 * 
 */

const verifyRequestHeaders = (req, res, next) => {

  if (res.getHeader('X-Client-Signature') !==  signature) {
    return res.status(400).send('Client signature is invalid');
  }

  // VERIFICATION FUNCTION... 
  // SOME CODE....

  return next();
}

/**
 * 
 *  @middleware rateLimiter
 * 
 *  @description - this middleware is used to rate limit the requests 
 * 
 */
  
// attach the rate limiter to all the routes. 
  app.use('*', (req, res, next) => {
  // set the request signature of hitting this middle ware... 
  res.setHeader('X-RateLimit-Limit', LIMIT);
  res.setHeader('X-Client-Signature', signature);

  // refresh the short term cache
  if (cache.get(currentIp) === undefined) {
      cache.set(currentIp, 0);
  }  
  
  // refresh the long term cache
  if (LongCache.get(currentIp) === undefined) {
      LongCache.set(currentIp, 0);
  }

  if (isClientBlocked() === true) {
    return res.status(429).send('Your IP has been blocked, for 24 hours');
  }

  // USE THIS IF YOU WANT TO USE SOME SORT OF KEY TO VERIFY THE REQUEST
  // BEFORE SHOWING THE RESULTS FROM THE API. 
   return verifyRequestHeaders(req, res, next);
}, verifyRateLimit);


/// -------------- end of rate limiters middleware ---------------------------



const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    return res.json(r.rows || [])
  }).catch(next)
}


app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})

const express = require("express");
const router = express.Router();
const passport = require("passport");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const flash = require("connect-flash");
require("dotenv").config();

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}
};

let redisClient = process.env.UPSTASH_REDIS_URL ? redis.createClient(redisConfig) : redis.createClient();

router.use(
  session({
    store: new RedisStore({
      client: redisClient
    }),
    saveUninitialized: false,
    secret: process.env.SESSIONSECRET,
    resave: false,
    cookie: {
      expires: 3 * 60 * 60 * 1000
    },
    rolling: true
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

module.exports = router;
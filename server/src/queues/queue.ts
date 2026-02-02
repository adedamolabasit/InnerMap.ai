import { Queue } from "bullmq";
import IORedis from "ioredis";
import 'dotenv/config';

require('dotenv').config();

export const connection = new IORedis({
  host: "redis-17558.c281.us-east-1-2.ec2.cloud.redislabs.com",
  port: 17558,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,

});


export const dreamQueue = new Queue("dreamQueue", { connection });

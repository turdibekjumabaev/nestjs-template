import { FactoryProvider } from '@nestjs/common'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

config()

const conf = {
    //@ts-ignore
    host: 'app_redis' ?? process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
}
export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis(conf)

        redisInstance.on('error', (e) => {
            console.error(`Redis connection failed: ${e}`)
        })

        return redisInstance
    },
    inject: [],
}
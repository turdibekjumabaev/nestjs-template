import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) { }

    private prefix = 'learn_app'

    /**
     * Called when the module is being destroyed.
     * Disconnects the Redis client.
     */
    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    /**
     * Retrieves the remaining time to live (TTL) of a Redis key.
     * @param key - The key to retrieve the TTL for.
     * @returns A promise that resolves to the TTL of the key in seconds.
     */
    async getExpiry(key: string): Promise<number> {
        return this.redisClient.ttl(`${this.prefix}:${key}`);
    }

    /**
     * Retrieves the value associated with the specified key from Redis.
     *
     * @param key - The key to retrieve the value for.
     * @returns A Promise that resolves to the value associated with the key.
     */
    async get(key: string): Promise<string> {
        return this.redisClient.get(`${this.prefix}:${key}`);
    }

    /**
     * Sets a value in Redis with the specified prefix and key.
     * @param key - The key to set the value for.
     * @param value - The value to be set.
     * @returns A Promise that resolves when the value is set.
     */
    async set(key: string, value: string): Promise<void> {
        await this.redisClient.set(`${this.prefix}:${key}`, value);
    }

    /**
     * Deletes a key from Redis with the specified prefix.
     * @param key - The key to delete.
     * @returns A Promise that resolves when the key is deleted.
     */
    async delete(key: string): Promise<void> {
        await this.redisClient.del(`${this.prefix}:${key}`);
    }

    /**
     * Sets a value in Redis with an expiry time.
     *
     * @param key - The key to set the value for.
     * @param value - The value to be set.
     * @param expiry - The expiry time in seconds.
     * @returns A Promise that resolves when the value is set.
     */
    async setWithExpiry(key: string, value: string, expiry: number): Promise<void> {
        await this.redisClient.set(`${this.prefix}:${key}`, value, 'EX', expiry);
    }
}
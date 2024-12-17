import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async getKeys(pattern: string): Promise<string[]> {
    const store = this.cacheManager['store'] as any; // Приведение типов
    if (typeof store.keys === 'function') {
      return await store.keys(pattern);
    }
    throw new Error('Метод keys недоступен');
  }

   getRedisClient(): RedisClientType {
    const store = this.cacheManager['store'] as any; // Приведение типов
    if (store && typeof store.getClient === 'function') {
      return store.getClient(); // Получение клиента Redis
    }
    
    throw new Error('Redis клиент недоступен');
  }
}
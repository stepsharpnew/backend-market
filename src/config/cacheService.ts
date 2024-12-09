import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()

export class CacheService{
    constructor(@Inject(CACHE_MANAGER) private cacheManeger:Cache ){}


    async get<T>(key:string):Promise<T|null>{
        return await this.cacheManeger.get<T>(key)
    }

    async set<T>(key:string, value, ttl):Promise<T|null|void>{
        return await this.cacheManeger.set(key,value, ttl)
    }

    async det<T>(key : string):Promise<T|null>{
        return await this.cacheManeger.get<T>(key)
    }

}
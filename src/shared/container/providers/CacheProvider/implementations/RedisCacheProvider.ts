import ICacheProvider from '../models/ICacheProvider'
import Redis, {Redis as RedisClient} from 'ioredis'
import cacheConfig from '@config/cache'

export default class RedisCacheProvider implements ICacheProvider {

    private client: RedisClient

    constructor() {
        this.client = new Redis(cacheConfig.config.redis)
    }

    public async save(key: string, value: string):Promise<void>{
        await this.client.set(key, JSON.stringify(value)) //se for um objeto passar o value assim: JSON.stringify(value)
    }

    public async recover<T>(key: string):Promise<T | null>{
        const data = await this.client.get(key)

        if(!data) {
            return null
        }

        const parsedData = JSON.parse(data) as T

        return parsedData
    }

    public async invalidate(key: string): Promise<void>{

    }


    public async invalidatePrefix(prefix: string): Promise<void>{
        const keys = await this.client.keys(`${prefix}:*`) //buscar todas as chaves que começam com prefix: e o que vem depois que é o id ele tras todos

        const pipeline = this.client.pipeline() //para poder executar algo multiplo ao mesmo tempo

        keys.forEach(key => {
            pipeline.del(key)
        } )

        await pipeline.exec()  //executar algo multiplo ao mesmo tempo

    }

}

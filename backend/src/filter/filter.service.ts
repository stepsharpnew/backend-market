import { Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/products/products.entity';
import { FilterDTO } from './filterDTO';

@Injectable()
export class FilterService {
    async filter (products : ProductEntity[], price_bottom : number, price_up : number){
        const  filtered = products.filter((product)=> product.price>price_bottom && product.price < price_up)
        // // console.log(filtered.map((el)=>el.id));
        return filtered

    }
}

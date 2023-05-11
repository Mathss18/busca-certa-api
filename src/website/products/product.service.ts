import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { SearchByTermDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async findProductByTerm(params: SearchByTermDto) {
    for (let i = 0; i < 4000000000; i++) {}
    return this.repository.findProductByTerm(params);
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }
}

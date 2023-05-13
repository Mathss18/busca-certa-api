import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { SearchByTermDto, SearchByTermPaginatedDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async findProductByTerm(params: SearchByTermPaginatedDto) {
    return this.repository.findProductByTerm(params);
  }

  async findHighlightProductByTerm(params: SearchByTermDto) {
    return this.repository.findHighlightProductByTerm(params);
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }
}

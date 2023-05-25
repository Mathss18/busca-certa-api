import { Injectable } from '@nestjs/common';
import { ProductsCategoryRepository } from './products-category.repository';
import { FindRelevantsByTermParams, FindRelevantsParams } from './dto/products-category.dto';
import { sortLevensthein } from '../../utils/sort.util';

@Injectable()
export class ProductsCategoryService {
  constructor(private readonly repository: ProductsCategoryRepository) {}

  async findRelevants(params: FindRelevantsParams) {
    return this.repository.findRelevants(params);
  }

  async findRelevantsByTerm(params: FindRelevantsByTermParams) {
    const relevantCategoriesByTerm = await this.repository.findRelevantsByTerm(params);

    // Sort categories based on Levenshtein distance to the search term
    return sortLevensthein(relevantCategoriesByTerm, params.term, 'name');
  }
}

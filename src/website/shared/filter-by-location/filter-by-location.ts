import { LocationDto } from '../../../shared/dto/location.dto';

export abstract class FilerByLocationRepository {
  /*
   * This method is used to filter products by supplier action areas.
   * It will follow the following rules:
   * 1. If the supplier has no action areas created, it means that they cover all national territory.
   * 2. If the supplier has action areas created and the city is null, it means that they cover the whole state.
   * 3. If the supplier has action areas created and the city is not null, it means that they cover the specif city within the state.
   */
  public filterBySupplierActionAreas(location: LocationDto) {
    const { city, state } = location;
    return {
      supplier: {
        OR: [
          {
            actionAreas: {
              equals: [],
            },
          },
          {
            actionAreas: {
              path: '$',
              array_contains: { city: null, state: state },
            },
          },
          {
            actionAreas: {
              path: '$',
              array_contains: { city: city, state: state },
            },
          },
        ],
      },
    };
  }
}

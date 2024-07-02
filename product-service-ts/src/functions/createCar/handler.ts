import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import CarService from 'src/db/CarService';
import StocksService from 'src/db/StocksService';

const createCar: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  console.log('Create a car with arguments ' + JSON.stringify(event.body));
  try {
    const { title, description, price, count } = event.body as any;
    const car = {
      title,
      description,
      price,
    };

    if (!title || !description || !price) {
      formatErrorJSONResponse('Need to fill all fields', 400);
    }

    const createdCarId = await CarService.createProduct(car);

    const createdStock = await StocksService.createStock({
      product_id: createdCarId,
      count,
    });

    return formatJSONResponse({
      car: {
        ...car,
        id: createdCarId,
        count: createdStock.count,
      },
    });
  } catch (error) {
    formatErrorJSONResponse(error, 500);
  }
};

export const main = middyfy(createCar);

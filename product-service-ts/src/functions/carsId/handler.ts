import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import CarService from 'src/db/CarService';
import StocksService from 'src/db/StocksService';

const carsId: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  console.log('Get car with id ' + JSON.stringify(event.pathParameters));
  try {
    const { id } = event.pathParameters;
    const [car, stock] = await Promise.all([
      CarService.getCarById(id),
      StocksService.getStocksById(id),
    ]);

    if (!car) {
      return formatErrorJSONResponse(`Car ${id} wasn't found`, 404);
    }

    const response = { ...car, count: stock?.count || 0 };

    return formatJSONResponse({
      car: response,
    });
  } catch (error) {
    formatErrorJSONResponse(error, 500);
  }
};

export const main = middyfy(carsId);

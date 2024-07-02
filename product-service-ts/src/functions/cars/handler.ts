import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import CarService from 'src/db/CarService';
import StocksService from 'src/db/StocksService';

const cars: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
  try {
    const cars = await CarService.getCars();

    const stocks = await StocksService.getStocks();

    const response = [];

    cars.forEach((car) => {
      const foundStock = stocks.find((stock) => stock.product_id === car.id);
      response.push({ ...car, count: foundStock.count });
    });

    return formatJSONResponse({
      cars: response,
    });
  } catch (error) {
    formatErrorJSONResponse(error, 500);
  }
};

export const main = middyfy(cars);

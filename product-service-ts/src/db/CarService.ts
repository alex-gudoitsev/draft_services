import { ICar } from 'src/types';
import { v4 } from 'uuid';
import { dynamo } from './initData';

class CarService {
  public async getCars(): Promise<ICar[]> {
    const result = (
      await dynamo
        .scan({
          TableName: 'products',
        })
        .promise()
    ).Items;

    return result as ICar[];
  }

  public async getCarById(id: string): Promise<ICar> {
    const result = await dynamo
      .query({
        TableName: 'products',
        KeyConditionExpression: `id = :id`,
        ExpressionAttributeValues: { ':id': id },
      })
      .promise();

    if (result?.Items?.length) {
      return result?.Items[0] as ICar;
    }

    return null;
  }

  public async createProduct(car): Promise<string> {
    const id = v4();

    await dynamo
      .put({
        TableName: 'products',
        Item: { ...car, id },
      })
      .promise();

    return id;
  }
}

export default new CarService();

import { ICar, IStock } from 'src/types';
import { dynamo } from './initData';

class StocksService {
  public async getStocks(): Promise<any> {
    const result = (
      await dynamo
        .scan({
          TableName: 'stocks',
        })
        .promise()
    ).Items;

    return result as ICar[];
  }

  public async getStocksById(id: string): Promise<IStock> {
    const result = await dynamo
      .query({
        TableName: 'stocks',
        KeyConditionExpression: `product_id = :product_id`,
        ExpressionAttributeValues: { ':product_id': id },
      })
      .promise();

    if (result?.Items?.length) {
      return result.Items[0] as IStock;
    }

    return null;
  }
  public async createStock(stock): Promise<IStock> {
    await dynamo
      .put({
        TableName: 'stocks',
        Item: { ...stock },
      })
      .promise();

    return stock;
  }
}

export default new StocksService();

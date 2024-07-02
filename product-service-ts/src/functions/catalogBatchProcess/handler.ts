import { formatErrorJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { dynamo } from 'src/db/initData';
import { IProduct } from 'src/types';
import { v4 } from 'uuid';

interface CatalogBatchProcessEventI extends APIGatewayProxyEvent {
  Records: {
    body: string;
  }[];
}

const catalogBatchProcessHandler = async (event: CatalogBatchProcessEventI) => {
  console.log('catalogBatchProcessHandler start');

  const sns = new AWS.SNS({ region: 'us-east-1' });

  const promises = [];

  try {
    const parsedList = event.Records.map(({ body }) => {
      return JSON.parse(body);
    });

    parsedList.forEach(async (car: IProduct) => {
      const { count, ...carAdditionalInfo } = car;

      const id = v4();

      const productPromise = dynamo
        .put({
          TableName: 'products',
          Item: { id, ...carAdditionalInfo },
        })
        .promise();

      const stockPromise = dynamo
        .put({
          TableName: 'stocks',
          Item: { product_id: id, count },
        })
        .promise();

      promises.push(productPromise);
      promises.push(stockPromise);
    });

    await Promise.all(promises);

    const snsMesssage = parsedList
      .map((product) => JSON.stringify(product))
      .join(' ');

    await sns
      .publish(
        {
          Subject: 'New cars are uploaded',
          Message: snsMesssage,
          TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
        },
        () => {
          console.log('Email is sent');
        }
      )
      .promise();
  } catch (e) {
    return formatErrorJSONResponse(e, 500);
  }
};

export const main = catalogBatchProcessHandler;

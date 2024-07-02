import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import middy from '@middy/core';
import * as AWS from 'aws-sdk';
import { QUEUE_MESSAGE } from 'src/constants';
import FileService from 'src/services/FileService/FileService';

const importFileParser: ValidatedEventAPIGatewayProxyEvent<void> = async (
  event: any
) => {
  console.log('start importFileParser: ');

  try {
    const csvKey = event.Records[0].s3.object.key;
    const parsedList = await FileService.parseFile(csvKey);

    if (!parsedList.length) return;

    const sqs = new AWS.SQS();

    for (const item of parsedList) {
      try {
        const result = await sqs
          .sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(item),
          })
          .promise();

        console.log(QUEUE_MESSAGE.QUEUE_SUCCESS, item.title, result);
      } catch (error) {
        console.error(QUEUE_MESSAGE.ERROR, item.title, error);
      }
    }
  } catch (e) {
    return formatErrorJSONResponse('Bad Request', 400);
  }
};

export const main = middy(importFileParser);

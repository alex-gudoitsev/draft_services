import {
  formatErrorJSONResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' });

const BUCKET = 'car-csv-bucket';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { name } = event.queryStringParameters;
  console.log('importProductsFile is invoked: ' + name);

  try {
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrl('putObject', params);

    return formatJSONResponse(url);
  } catch (e) {
    return formatErrorJSONResponse(e, 500);
  }
};

export const main = middyfy(importProductsFile);

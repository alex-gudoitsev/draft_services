import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['sqsCreateProductQueue2', 'Arn'] },
        batchSize: 5,
        enabled: true,
      },
    },
  ],
};

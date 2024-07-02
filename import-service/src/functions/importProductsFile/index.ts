import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        authorizer: {
          type: 'token',
          resultTtlInSeconds: 0,
          identityValidationExpression: '^Basic [-0-9a-zA-Z._=]*$',
          arn: 'arn:aws:lambda:us-east-1:355730231044:function:authorization-service-dev-basicAuthorizer',
        },
      },
    },
  ],
};

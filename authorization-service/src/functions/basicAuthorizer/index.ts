import { handlerPath } from '@libs/handler-resolver';

const basicAuthorizer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
};

export default basicAuthorizer;

import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import AuthService from 'src/services/AuthService/AuthService';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  const { authorizationToken: token, methodArn } = event;

  const response = AuthService.getAuthorizationResponse(methodArn, token);

  return response;
};

export const main = basicAuthorizer;

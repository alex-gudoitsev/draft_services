import { APIGatewayAuthorizerResult, PolicyDocument } from 'aws-lambda';
import { Effect } from 'src/constants';

export class AuthService {
  static getAuthorizationResponse(
    resource: string,
    authorizationToken: string
  ): APIGatewayAuthorizerResult {
    const effect = AuthService.getEffect(authorizationToken);
    const policyDocument = AuthService.getPolicyDocument(resource, effect);

    return {
      principalId: 'user',
      policyDocument,
    };
  }

  static getPolicyDocument(resource: string, effect: Effect): PolicyDocument {
    return {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
  }

  static getEffect(authorizationToken: string) {
    if (authorizationToken) {
      const [, value] = authorizationToken.split(' ');
      const decoded = Buffer.from(value, 'base64').toString('utf8');
      const [userLogin, userPassword] = decoded.split(':');

      if (process.env[userLogin] && process.env[userLogin] === userPassword) {
        return Effect.Allow;
      }
    }

    return Effect.Deny;
  }
}

export default AuthService;

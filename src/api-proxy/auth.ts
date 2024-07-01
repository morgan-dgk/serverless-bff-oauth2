import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const REDIRECT_URI = 'http:/localhost:8080/authorize?redirect_uri=http:/localhost:3000/login&response_type=code';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        body: REDIRECT_URI,
    };
};

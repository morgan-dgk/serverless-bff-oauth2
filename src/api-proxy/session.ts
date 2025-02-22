import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const DOCKER_NETWORK_BRIDGE_ADDR = 'http://172.17.0.1';

const dynamodbClient = new DynamoDBClient({
    endpoint: `${DOCKER_NETWORK_BRIDGE_ADDR}:8000`,
    region: 'fakeRegion',
    credentials: { accessKeyId: 'fakeMyKeyId', secretAccessKey: 'fakeSecretAccessKey' },
});

type SessionInfo = {
    accessToken: string;
    refreshToken: string;
    isActive: boolean;
};

type AuthResponse = {
    isAuthorized: boolean;
};

const getSessionInfo = async (sessionId: string): Promise<SessionInfo | undefined> => {
    const getItemCommandInput = {
        Key: { sessionId: marshall(sessionId) },
        TableName: 'Sessions',
    };

    const getItemCmd = new GetItemCommand(getItemCommandInput);

    const resp = await dynamodbClient.send(getItemCmd);

    return resp.Item ? (unmarshall(resp.Item) as SessionInfo) : undefined;
};

/**
 * Check whether there is an existing session associated with the incoming request
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let resp: AuthResponse;
    console.log(event.headers);
    const current_time = Math.floor(new Date().getTime() / 1000);
    const sid = event.headers?.Sid;

    if (!sid) {
        resp = { isAuthorized: false };
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(resp),
        };
    }

    const sessionInfo = await getSessionInfo(sid);

    if (sessionInfo) {
        resp = { isAuthorized: true };

        return {
            statusCode: 200,
            headers: { headerName: 'headerValue' },
            body: JSON.stringify(resp),
        };
    }
};

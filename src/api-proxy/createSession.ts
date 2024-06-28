import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';

const DOCKER_NETWORK_BRIDGE_ADDR = 'http://172.17.0.1';

const dynamodbClient = new DynamoDBClient({
    endpoint: `${DOCKER_NETWORK_BRIDGE_ADDR}:8000`,
    region: 'fakeRegion',
    credentials: { accessKeyId: 'fakeMyKeyId', secretAccessKey: 'fakeSecretAccessKey' },
});

type sessionInfo = {
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    createdAt: number;
    expiresAt: number;
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const current_time = Math.floor(new Date().getTime());
    const expires_at = Math.floor((new Date().getTime() + 3600000) / 1000);
    const sid = randomUUID();

    const session_info: sessionInfo = {
        sessionId: sid,
        accessToken: '',
        refreshToken: '',
        createdAt: current_time,
        expiresAt: expires_at,
    };

    const putItemCmd = new PutItemCommand({ Item: marshall(session_info), TableName: 'Sessions' });

    const resp = await dynamodbClient.send(putItemCmd);

    console.log(resp, 'session id: ', sid);

    return {
        statusCode: 200,
        headers: { sid },
        body: JSON.stringify(sid),
    };
};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';

const DOCKER_NETWORK_BRIDGE_ADDR = 'http://172.17.0.1';
const TOKEN_ENDPOINT = `${DOCKER_NETWORK_BRIDGE_ADDR}:8080/token`;

const dynamodbClient = new DynamoDBClient({
    endpoint: `${DOCKER_NETWORK_BRIDGE_ADDR}:8000`,
    region: 'fakeRegion',
    credentials: { accessKeyId: 'fakeMyKeyId', secretAccessKey: 'fakeSecretAccessKey' },
});

type sessionInfo = {
    sessionId: string;
    access_token: string;
    refresh_token: string;
    created_at: number;
    expires_at: number;
};

const createSession = async (access_token: string, refresh_token: string): Promise<string> => {
    const current_time = Math.floor(new Date().getTime());
    const expires_at = Math.floor((new Date().getTime() + 3600000) / 1000);
    const sid = randomUUID();

    const session_info: sessionInfo = {
        sessionId: sid,
        access_token,
        refresh_token,
        created_at: current_time,
        expires_at: expires_at,
    };

    console.log(session_info);

    const putItemCmd = new PutItemCommand({ Item: marshall(session_info), TableName: 'Sessions' });

    const resp = await dynamodbClient.send(putItemCmd);

    console.log(resp, 'session id: ', sid);

    return sid;
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const code = event.queryStringParameters?.code;

    if (code) {
        const resp = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${code}`,
        });
        const { access_token, refresh_token, id_token } = await resp.json();

        const sid = await createSession(access_token, refresh_token);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', sid },
            body: JSON.stringify(id_token),
        };
    }
    return {
        statusCode: 500,
        body: 'internal server error',
    };
};

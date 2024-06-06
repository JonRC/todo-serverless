import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ZodError } from "zod";

export const createHandler =
  <T extends any = any>(
    fn: (
      event: APIGatewayProxyEvent,
      context: Context
    ) => Promise<{
      statusCode: number;
      body?: NoInfer<T>;
    }>
  ) =>
  async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { statusCode, body } = await fn(event, context).catch((error) => {
      console.error("Unexpected error!");
      console.error(error);

      if (error instanceof ZodError) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Error on data parsing. Possible in the request",
            error: error.message,
          }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal server error",
        }),
      };
    });

    return {
      body: JSON.stringify(body),
      statusCode,
    };
  };

import { fetchTodo } from "../Repository/fetchTodo";
import z from "zod";
import { createHandler } from "../Util/createHandler";

const pathParamsSchema = z.object({
  id: z.string(),
});

export const handler = createHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const pathParams = await pathParamsSchema.parseAsync(
    event.pathParameters || {}
  );

  const todo = await fetchTodo(pathParams.id);

  if (!todo)
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Todo not found" }),
    };

  return {
    statusCode: 200,
    body: { todo },
  };
});

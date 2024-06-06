import { fetchTodo } from "../Repository/fetchTodo";
import z from "zod";
import { deleteTodo } from "../Repository/deleteTodo";
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
      body: { message: "Todo not found" },
    };

  if (!todo.completed) {
    return {
      body: {
        message: "It's not possible delete an uncompleted todo",
      },
      statusCode: 400,
    };
  }

  await deleteTodo(pathParams.id);

  return {
    statusCode: 204,
  };
});

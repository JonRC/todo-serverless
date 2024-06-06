import { fetchTodo } from "../Repository/fetchTodo";
import z from "zod";
import { updateTodo } from "../Repository/updateTodo";
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

  if (todo.completed) {
    return {
      body: { message: "Todo is already completed" },
      statusCode: 400,
    };
  }

  const updatedTodo = await updateTodo(pathParams.id, { completed: true });

  return {
    statusCode: 200,
    body: { todo: updatedTodo },
  };
});

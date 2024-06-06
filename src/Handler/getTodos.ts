import { fetchTodos } from "../Repository/fetchTodos";
import z from "zod";
import { createHandler } from "../Util/createHandler";

const queryParamSchema = z
  .object({
    "next-key": z.string().optional(),
  })
  .optional()
  .nullable();

export const handler = createHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const queryParam = await queryParamSchema.parseAsync(
    event.queryStringParameters
  );

  const { todos, nextKey } = await fetchTodos(queryParam?.["next-key"]);

  return {
    statusCode: 200,
    body: { todos, nextKey },
  };
});

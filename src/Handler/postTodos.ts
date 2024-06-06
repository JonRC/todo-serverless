import z from "zod";
import { saveTodo } from "../Repository/saveTodo";
import { Todo } from "../Entity/Todo";
import { randomUUID } from "crypto";
import { createHandler } from "../Util/createHandler";

const bodySchema = z.object({
  title: z.string(),
  dueDate: z.string().date().optional(),
  description: z.string().optional(),
});

export const handler = createHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const body = bodySchema.parse(JSON.parse(event.body || "{}"));
  const newTodo: Todo = {
    id: randomUUID(),
    title: body.title,
    completed: false,
    metadata: {
      description: body.description,
      dueDate: body.dueDate,
    },
  };

  await saveTodo(newTodo);

  return {
    statusCode: 200,
    body: { todo: newTodo },
  };
});

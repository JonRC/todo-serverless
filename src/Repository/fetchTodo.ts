import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamodbClient } from "../Service/dynamodbClient";
import { Todo, TodoFromDbItem } from "../Entity/Todo";

export const fetchTodo = async (id: string): Promise<Todo | undefined> => {
  const getCommand = new GetItemCommand({
    Key: {
      id: { S: id },
    },
    TableName: "todoTable",
  });

  const result = await dynamodbClient().send(getCommand);

  if (!result.Item) return undefined;

  const todo = await Todo.parseAsync(TodoFromDbItem(result.Item));

  return todo;
};

import {
  AttributeValueUpdate,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Todo, TodoFromDbItem } from "../Entity/Todo";
import { dynamodbClient } from "../Service/dynamodbClient";

export const updateTodo = async (
  id: string,
  todoUpdates: Partial<Pick<Todo, "completed">>
): Promise<Todo> => {
  const attributeUpdates: Record<string, AttributeValueUpdate> = {};

  if (todoUpdates.completed !== undefined) {
    attributeUpdates.completed = {
      Action: "PUT",
      Value: { BOOL: todoUpdates.completed },
    };
  }

  const updateCommand = new UpdateItemCommand({
    TableName: "todoTable",
    Key: {
      id: { S: id },
    },
    ReturnValues: "ALL_NEW",
    AttributeUpdates: attributeUpdates,
  });

  const result = await dynamodbClient().send(updateCommand);

  const updatedTodo = await Todo.parseAsync(TodoFromDbItem(result.Attributes));

  return updatedTodo;
};

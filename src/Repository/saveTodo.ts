import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Todo, TodoDbItem } from "../Entity/Todo";
import { dynamodbClient } from "../Service/dynamodbClient";

export const saveTodo = async (todo: Todo) => {
  const putCommand = new PutItemCommand({
    TableName: "todoTable",
    Item: TodoDbItem(todo),
  });
  await dynamodbClient().send(putCommand);
};

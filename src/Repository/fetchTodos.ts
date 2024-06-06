import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { Todo, TodoFromDbItem } from "../Entity/Todo";
import { dynamodbClient } from "../Service/dynamodbClient";
import z from "zod";

export const fetchTodos = async (
  nextKey?: any
): Promise<{
  todos: Todo[];
  nextKey?: any;
}> => {
  const scanCommand = new ScanCommand({
    TableName: "todoTable",
    ExclusiveStartKey: nextKey,
  });

  const result = await dynamodbClient().send(scanCommand);

  const todos = await z
    .array(Todo)
    .parseAsync(result.Items?.map((item) => TodoFromDbItem(item)));

  return {
    todos,
    nextKey: result.LastEvaluatedKey,
  };
};

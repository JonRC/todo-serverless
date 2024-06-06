import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamodbClient } from "../Service/dynamodbClient";

export const deleteTodo = async (id: string) => {
  const deleteCommand = new DeleteItemCommand({
    Key: {
      id: { S: id },
    },
    TableName: "todoTable",
  });

  await dynamodbClient().send(deleteCommand);
};

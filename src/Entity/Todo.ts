import { AttributeValue } from "@aws-sdk/client-dynamodb";
import z from "zod";

export const TodoMetadata = z.object({
  description: z.string().optional(),
  dueDate: z.string().optional(),
});
export type TodoMetadata = z.infer<typeof TodoMetadata>;

export const Todo = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  metadata: TodoMetadata,
});
export type Todo = z.infer<typeof Todo>;

export const TodoDbItem = (entity: Todo) =>
  ({
    id: { S: entity.id },
    completed: { BOOL: entity.completed },
    metadata: { M: TodoMetadataToDbItem(entity.metadata) },
    title: { S: entity.title },
  } satisfies Record<keyof Todo, AttributeValue>);

export type TodoDbItem = ReturnType<typeof TodoDbItem>;

export const TodoMetadataToDbItem = (entity: TodoMetadata) => {
  let item = {} as Record<keyof TodoMetadata, AttributeValue>;

  if (entity.description) {
    item["description"] = { S: entity.description };
  }

  if (entity.dueDate) {
    item["dueDate"] = { S: entity.dueDate };
  }

  return item;
};

export type TodoMetadataDbItem = ReturnType<typeof TodoMetadataToDbItem>;

export const TodoFromDbItem = (item?: Partial<TodoDbItem>): Partial<Todo> => ({
  id: item?.id?.S,
  completed: item?.completed?.BOOL,
  metadata: TodoMetadataFromDbItem(item?.metadata?.M),
  title: item?.title?.S,
});

export const TodoMetadataFromDbItem = (
  item?: Partial<TodoMetadataDbItem>
): Partial<TodoMetadata> | undefined => {
  if (!item) return undefined;
  return {
    description: item.description?.S,
    dueDate: item.dueDate?.S,
  };
};

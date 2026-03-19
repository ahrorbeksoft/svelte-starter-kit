import type { AppSchema } from "$lib/instant.schema";
import type { InstaQLParams, InstaQLResult } from "@instantdb/svelte";

export const todosQuery = (userId: string) =>
  ({
    todos: {
      $: {
        where: {
          "owner.id": userId
        },
        order: {
          createdAt: "desc"
        }
      }
    }
  }) satisfies InstaQLParams<AppSchema>;

export type TodosQueryResult = InstaQLResult<AppSchema, ReturnType<typeof todosQuery>>;
export type Todo = TodosQueryResult["todos"][number];

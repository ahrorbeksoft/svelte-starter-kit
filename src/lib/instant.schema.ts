// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/admin";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string()
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional()
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional()
    }),
    todos: i.entity({
      title: i.string(),
      completed: i.boolean(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed()
    })
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files"
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade"
      }
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade"
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers"
      }
    },
    $usersTodos: {
      forward: {
        on: "todos",
        has: "one",
        label: "owner",
        required: true,
        onDelete: "cascade"
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "todos"
      }
    }
  },
  rooms: {}
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

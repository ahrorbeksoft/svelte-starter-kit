<script lang="ts">
  import { getConfirm } from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { db } from "$lib/db";
  import { createAsync } from "$lib/hooks/create-async.svelte";
  import { TrashIcon } from "@lucide/svelte";
  import type { Todo } from "./query";
  import { Spinner } from "$lib/components/ui/spinner";

  const { todo }: { todo: Todo } = $props();

  const updateTodo = createAsync(async (completed: boolean) => {
    await db.transact(db.tx.todos[todo.id].update({ completed }));
  });

  const confirm = getConfirm();

  const deleteTodo = createAsync(async () => {
    const confirmed = await confirm({
      title: "Delete todo",
      description: "Are you sure you want to delete this todo?",
      confirmLabel: "Delete",
      confirmVariant: "destructive"
    });
    if (!confirmed) return;
    await db.transact(db.tx.todos[todo.id].delete());
  });
</script>

<li class="flex items-center gap-3 px-4 py-3">
  <Checkbox
    class="h-6 w-6 cursor-pointer"
    checked={todo.completed}
    onCheckedChange={(completed) => updateTodo.run(completed)}
    aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
  />

  <div class="min-w-0 flex-1">
    <p
      class={todo.completed
        ? "truncate text-sm text-muted-foreground line-through"
        : "truncate text-sm font-medium"}
    >
      {todo.title}
    </p>
  </div>

  <Button variant="destructive" size="icon" onclick={() => deleteTodo.run()}>
    {#if deleteTodo.isLoading()}
      <Spinner />
    {:else}
      <TrashIcon />
    {/if}
  </Button>
</li>

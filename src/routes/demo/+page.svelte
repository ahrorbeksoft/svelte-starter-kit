<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";
  import { auth, db, useQuery } from "$lib/db";
  import { createAsync } from "@sveltebase/utils";
  import AddForm from "./_components/add-form.svelte";
  import Login from "./_components/login.svelte";
  import { todosQuery } from "./_components/query.js";
  import Todo from "./_components/todo.svelte";

  let { data } = $props();

  const q = useQuery(
    () => (auth.user ? todosQuery(auth.user?.id) : null),
    () => data.todos
  );

  const todos = $derived(q.data?.todos ?? []);

  const completedCount = $derived(todos.filter((todo) => todo.completed).length);
  const activeCount = $derived(todos.length - completedCount);

  const markActiveDone = createAsync(async (status: boolean) => {
    const batch = [];

    for (const t of todos) {
      batch.push(db.tx.todos[t.id].update({ completed: status }));
    }

    if (batch.length > 0) {
      await db.transact(batch);
    }

    return { success: "All tasks marked as " + (status ? "done" : "active") };
  });

  const clearCompleted = createAsync(async () => {
    const batch = [];

    for (const t of todos.filter((todo) => todo.completed)) {
      batch.push(db.tx.todos[t.id].delete());
    }

    if (batch.length > 0) {
      await db.transact(batch);
    }

    return { success: "Completed tasks cleared" };
  });
</script>

<svelte:head>
  <title>Todo Demo</title>
  <meta name="description" content="Todo demo with CRUD operations." />
</svelte:head>

{#if !auth.user}
  <Login />
{:else}
  <div class="mx-auto max-w-2xl p-5">
    <div class="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
      <div class="border-b px-5 py-5 sm:px-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold tracking-tight">Todo list</h1>
          <p class="mt-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              {todos.length} total
            </Badge>
            <Badge variant="outline">
              {activeCount} active
            </Badge>
            <Badge variant="outline">
              {completedCount} completed
            </Badge>
          </p>
        </div>

        <div class="mt-5">
          <AddForm />
        </div>
      </div>

      <div class="px-5 py-5 sm:px-6">
        <section class="space-y-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <h2 class="text-base font-semibold">Tasks</h2>
              <p class="text-sm text-muted-foreground">
                {#if todos.length}
                  {activeCount} left · {completedCount} completed
                {:else}
                  No tasks yet
                {/if}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onclick={() => markActiveDone.run(!!activeCount)}
                class="transition-all"
              >
                {#if markActiveDone.isLoading()}
                  <Spinner />
                  Updating...
                {:else if activeCount > 0}
                  Mark all done
                {:else}
                  Mark all active
                {/if}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onclick={() => clearCompleted.run()}
                disabled={completedCount === 0}
              >
                {#if clearCompleted.isLoading()}
                  <Spinner />
                  Clearing...
                {:else}
                  Clear completed
                {/if}
              </Button>
            </div>
          </div>

          <Separator />

          {#if q.isLoading}
            <div
              class="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground"
            >
              Loading tasks...
            </div>
          {:else if todos.length === 0}
            <div
              class="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground"
            >
              Add your first task above to get started.
            </div>
          {:else}
            <ul class="divide-y rounded-xl border">
              {#each todos as todo (todo.id)}
                <Todo {todo} />
              {/each}
            </ul>
          {/if}
        </section>
      </div>
    </div>
  </div>
{/if}

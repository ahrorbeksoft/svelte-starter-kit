<script lang="ts" module>
  import type { Snippet } from "svelte";

  export class RenderSnippetConfig<TProps> {
    snippet: Snippet<[TProps]>;
    params: TProps;

    constructor(snippet: Snippet<[TProps]>, params: TProps) {
      this.snippet = snippet;
      this.params = params;
    }
  }

  /**
   * Wraps a Svelte snippet and its parameters so FlexRender knows how to render it.
   */
  export function renderSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps = {} as TProps) {
    return new RenderSnippetConfig(snippet, params);
  }
</script>

<script lang="ts">
  // 1. Updated Props to accept RenderSnippetConfig directly
  type Props = {
    content?: string | ((context: any) => any) | RenderSnippetConfig<any>;
    context?: any;
  };

  let { content, context }: Props = $props();
</script>

{#if typeof content === "string"}
  {content}
{:else if content instanceof RenderSnippetConfig}
  {@const { snippet, params } = content}
  {@render snippet(params)}
{:else if typeof content === "function"}
  {@const result = content(context)}

  {#if result instanceof RenderSnippetConfig}
    {@const { snippet, params } = result}
    {@render snippet(params)}
  {:else}
    {result}
  {/if}
{/if}

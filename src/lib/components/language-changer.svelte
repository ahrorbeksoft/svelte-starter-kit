<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { languages } from "$lib/constants";
  import { i18n } from "$lib";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="flex items-center justify-center px-2.5 transition-all"
        {...props}
      >
        {#key i18n.locale}
          <span class="md:hidden">
            <i18n.currentLanguage.icon class="h-5 w-5" />
          </span>
          <span class="hidden items-center gap-2 md:flex">
            <i18n.currentLanguage.icon class="h-5 w-5" />
            {i18n.currentLanguage.label}
          </span>
        {/key}
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-40">
    <DropdownMenu.RadioGroup bind:value={i18n.locale}>
      {#each languages as lang (lang.code)}
        <DropdownMenu.RadioItem class="flex cursor-pointer" value={lang.code}>
          <lang.icon class="mr-2 h-5 w-5" />
          {lang.label}
        </DropdownMenu.RadioItem>
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>

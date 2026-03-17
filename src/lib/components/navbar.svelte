<script lang="ts">
  import { Menu } from "@lucide/svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import faviconSvg from "$lib/assets/favicon.svg";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { siteTitle } from "$lib/constants";
  import { route } from "$lib/ROUTES";
  import ModeChanger from "$lib/components/mode-changer.svelte";
  import LanguageChanger from "$lib/components/language-changer.svelte";
  import type { Snippet } from "svelte";

  const {
    menuLinks = [],
    right,
    homeLink
  }: {
    menuLinks?: {
      label: string;
      href: string;
    }[];
    right?: Snippet;
    homeLink?: string;
  } = $props();
</script>

{#snippet logo()}
  <a class="flex items-center gap-2" href={homeLink ?? route("/")}>
    <img src={faviconSvg} class="w-8" alt="logo2" />
    <span class="text-lg font-semibold">{siteTitle}</span>
  </a>
{/snippet}

{#snippet toggles()}
  <div class="flex items-center justify-center gap-2">
    <ModeChanger />
    <LanguageChanger />

    {@render right?.()}
  </div>
{/snippet}

<section class="sticky top-0 z-50 flex h-14 border-b border-border bg-background p-2">
  <div class="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
    <nav class="hidden justify-between lg:flex">
      <div class="flex items-center gap-6">
        {@render logo()}

        <div class="flex items-center">
          <NavigationMenu.Root>
            <NavigationMenu.List>
              {#each menuLinks as menu, i (i)}
                <NavigationMenu.Item>
                  <NavigationMenu.Link href={menu.href}>
                    {menu.label}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              {/each}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>
      <div class="flex gap-6">
        {@render toggles()}

        <!-- {/* <div class="flex gap-2">
							<Button asChild variant="outline">
								<Link href="/login">Login</Link>
							</Button>
							<Button asChild>
								<Link href="/register">Sign up</Link>
							</Button>
						</div> */} -->
      </div>
    </nav>
    <div class="block lg:hidden">
      <div class="flex items-center justify-between">
        {@render logo()}
        <Sheet.Root>
          <div class="flex items-center justify-end gap-2">
            {@render toggles()}
            <Sheet.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
              <Menu class="size-4" />
            </Sheet.Trigger>
          </div>
          <Sheet.Content class="overflow-y-auto">
            <Sheet.Header>
              <Sheet.Title>
                <!-- <Logo /> -->
              </Sheet.Title>
            </Sheet.Header>
            <div class="flex flex-col gap-6 p-4">
              {#each menuLinks as menu, i (i)}
                <a
                  class="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
                  href={menu.href}
                >
                  <div class="text-sm font-semibold">{menu.label}</div>
                </a>
              {/each}

              <!-- <div class="flex flex-col gap-3">
                <Button variant="outline" href={route("/login")}>
                  {t("login")}
                </Button>
                <Button href={route("/register")}>
                  {t("register")}
                </Button>
              </div> -->
            </div>
          </Sheet.Content>
        </Sheet.Root>
      </div>
    </div>
  </div>
</section>

import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { kitRoutes } from "vite-plugin-kit-routes";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), kitRoutes()] });

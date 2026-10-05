// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
  siteName: "Blog",
  brand: {
    title: "Blog",
    subtitle: "仅记录一些常用的知识",
    logo: "✨",
  },
  sidebar: {
    author: "Avein",
    description: "梦想一辈子不上班。",
    social: {
      github: {
        url: "https://github.com/EdWard0x",
        icon: "i-ri-github-line",
      },
    },
  },
  footer: {
    since: 2026,
    icon: {
      name: "sakura rotate",
      color: "var(--color-pink)",
    },
    count: true,
    powered: true,
  },
});

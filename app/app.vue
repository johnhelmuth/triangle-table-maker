<script setup lang="ts">

import {version} from '~/../package.json';

const route = useRoute();

const appVersion = `v${version}`;
const copyrightDate = "2025";

/*
 * Workaround this issue where the tailwindcss vite plugin tries to convert hsl() colors to hex codes, which impacts
 *   hsl(from hsl(...) ...) color specifications from working correctly.
 *
 *   https://github.com/tailwindlabs/tailwindcss/issues/18591
 *   https://github.com/tailwindlabs/tailwindcss/issues/18103
 *   https://github.com/tailwindlabs/tailwindcss/discussions/18110
 *
 * Trying this workaround to just use the main.css file out of the public/ directory, avoiding the css processing.
 */
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "/css/main.css"
    }
  ]
})

const title = ref('Triangle Table Maker');

</script>

<template>
  <div class="page-container">
    <NuxtRouteAnnouncer/>
    <h1>
      <NuxtLink v-if="route.path !== '/'" to="/" title="Triangle table maker home.">{{ title }}</NuxtLink>
      <span v-else>{{title}}</span>
    </h1>
    <NuxtPage/>
    <footer>
      <span class="left">{{ appVersion }}</span>
      <span class="right">&copy; John Helmuth {{ copyrightDate }}</span>
      <a class="github-link" href="https://github.com/johnhelmuth/triangle-table-maker" title="Code repository for Triangle Table Maker at Github.com" target="_blank">
        <Icon name="octicon:mark-github-24" class="github-link-icon"/>
      </a>
    </footer>
  </div>
</template>

<style scoped>

.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-container > * {
  width: calc(100vw - 10rem);
  flex: 1 1 100cqh;
}

.page-container h1 {
  flex: 1 0 auto;
}
.page-container h1 a {
  text-decoration: none;
  color: inherit;
}
.page-container footer {
  flex: 1 0 auto;
}

h1 {
  text-align: center;
}

footer {
  margin: 2rem 1rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
footer > * {
  margin-left: 1rem;
}
footer > :first-child {
  margin-left: 0;
  margin-right: auto;
}
.github-link {
  font-size: 1.5rem;
  text-decoration: none;
}
</style>
<script setup lang="ts">
</script>
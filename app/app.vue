<script setup lang="ts">

import {version} from '~/../package.json';

const appVersion = `v${version}`;
const copyrightDate = "2025";

</script>

<template>
  <div>
    <NuxtRouteAnnouncer/>
    <h1>Triangle Table Maker</h1>
    <NuxtPage/>
    <footer>
      <span class="left">{{ appVersion }}</span>
      <span class="right">&copy; John Helmuth {{ copyrightDate }}</span>
      <a class="github-link" href="https://github.com/johnhelmuth/triangle-table-maker" target="_blank">
        <Icon name="octicon:mark-github-24" class="github-link-icon"/>
      </a>
    </footer>
  </div>
</template>

<style scoped>
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
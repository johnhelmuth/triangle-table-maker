<script setup lang="ts">

import { version } from '~/../package.json';

const appVersion = `v${version}`;
const copyrightDate = "2025";

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <h1>Triangle Table Maker</h1>
    <NuxtPage />
    <footer>
      <span class="left">Version {{ appVersion }}</span>
      <span class="right">&copy; John Helmuth {{ copyrightDate }}</span>
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
}
</style>
<script setup lang="ts">
</script>
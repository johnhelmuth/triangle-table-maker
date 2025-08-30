<script setup lang="ts">

import type {ItemInterface} from "~/components/TriangleTable.vue";

const items = [
  { name: "Negator" },
  { name: "Telepathy" },
  { name: "Telekinesis" },
  { name: "Regeneration" },
  { name: "Doppelganger" },
  { name: "Shapeshifting" },
  { name: "Brick" },
  { name: "Speedster" },
  { name: "X-Ray Vision" },
  { name: "Flamer" },
  { name: "Chameleon" },
  { name: "Ghost" },
  { name: "Metalhead" },
  { name: "Insect" },
  { name: "Oracle" },
] as Array<ItemInterface>;

</script>

<template>
  <div>
    <TriangleTable :items="items" />
  </div>
</template>

<style scoped>

</style>
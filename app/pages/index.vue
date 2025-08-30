<script setup lang="ts">

import type {ItemInterface} from "~/components/TriangleTable.vue";
import {probabilityDisplayType, type ProbabilityDisplayTypesType} from "~/utils/TriangleTableTypes";

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

const probabilityDisplay = ref('Color') as Ref<ProbabilityDisplayTypesType>;

function colorCheckChanged() {
  console.log('colorCheckChanged() clicked.');
  if (probabilityDisplay.value === 'Color') {
    probabilityDisplay.value = probabilityDisplayType.None;
  } else {
    probabilityDisplay.value = probabilityDisplayType.Color;
  }
}

</script>

<template>
  <div class="triangle-page">
    <TriangleTable :items="items" :show-probabilities-as="probabilityDisplay"/>
    <div class="triangle-options">
      <label for="odds-colors">Show colors</label>
      <input type="checkbox" name="probability-colors" :checked="probabilityDisplay === probabilityDisplayType.Color" @change="colorCheckChanged">
    </div>
  </div>
</template>

<style scoped>

div.triangle-page {
  margin: 1rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
}

div.triangle-options {
  position: absolute;
  position-anchor: --triangle-table;
  right: 3.5rem;
  right: calc(anchor(right) + 1rem);
  top: 3rem;
  top: calc(anchor(top) + 0.5rem);
}
div.triangle-options label {
  display: none;
  font-size: 0.75rem;
  font-family: sans-serif;
}
div.triangle-options:hover label {
  display: inline;
}

</style>
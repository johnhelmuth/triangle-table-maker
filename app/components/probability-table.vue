<script setup lang="ts">

import {getCellProbabilityFromIndex} from "~/utils/triangle-table-utils";
import type {RandomItemListInterface} from "~/models/RandomItemList";

const props = defineProps<{
  itemList: RandomItemListInterface
}>();

const itemsWithProbabilities = computed(() => {
  const localItems = props.itemList.items.map((item, index) => {
    const probability = getCellProbabilityFromIndex(index) || 0;
    const probAsPercentage = (100*probability/props.itemList.probabilityMax).toPrecision(3)
    return {
      ...item,
      probability,
      probAsPercentage
    };
  });
  localItems.sort((a, b) => b.probability - a.probability);
  let lowerThreshold = 0;
  let upperThreshold = 0;
  let lower = 1;
  let upper = 0;
  localItems.forEach((item, index) => {
    const percentage = (100.0*item.probability/props.itemList.probabilityMax);
    upperThreshold = lowerThreshold + percentage;
    if (index === props.itemList.items.length - 1) {
      upperThreshold = 100.0;
    }
    upper = Math.floor(upperThreshold+0.5);
    const d100Range = [lower, upper, upper-lower+1];
    lowerThreshold = upperThreshold;
    lower = upper + 1;
    item.d100Range = d100Range;
  })
  return localItems;
})
</script>

<template>

  <div>
    <h2>Table of probabilities</h2>
    <div class="items-list">
      <div class="col-header">Name</div><div class="col-header">Probability</div><div class="col-header">Probability<br>(%)</div><div class="col-header">d100</div>
      <template v-for="(item, index) of itemsWithProbabilities" :key="`item-${index}`">
        <div>{{ item.name }}</div>
        <div>{{ item.probability }} in {{ itemList.probabilityMax }}</div>
        <div>{{ item.probAsPercentage }}%</div>
        <div v-if="item.d100Range?.length">
          {{ item.d100Range[0] }}
          <span v-if="item.d100Range[0] != item.d100Range[1]">- {{ item.d100Range[1] }}</span>
          <!-- {{ item.d100Range[2] }} -->
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

h2 { text-align: center; }

div.items-list {
  width: 40em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  row-gap: 0.25rem;
}

@media (max-width: 800px) {
  div.items-list {
    font-size: 0.8rem;
  }
}

@media (max-width: 500px) {
  div.items-list {
    font-size: 0.5rem;
  }
}

div.col-header {
  font-weight: bold;
}

div.items-list div {
  text-align: center;
}
div.items-list div:nth-child(4n-3) {
  text-align: right;
}
</style>
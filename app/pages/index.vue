<script setup lang="ts">

import type {ItemInterface} from "~/components/TriangleTable.vue";
import {getCellProbabilityFromIndex} from "~/utils/triangle-table-utils";

const items = reactive([
  { name: "Negator" } as ItemInterface,
  { name: "Telepathy" } as ItemInterface,
  { name: "Telekinesis" } as ItemInterface,
  { name: "Regeneration" } as ItemInterface,
  { name: "Doppelganger" } as ItemInterface,
  { name: "Shapeshifting" } as ItemInterface,
  { name: "Brick" } as ItemInterface,
  { name: "Speedster" } as ItemInterface,
  { name: "X-Ray Vision" } as ItemInterface,
  { name: "Flamer" } as ItemInterface,
  { name: "Chameleon" } as ItemInterface,
  { name: "Ghost" } as ItemInterface,
  { name: "Metalhead" } as ItemInterface,
  { name: "Insect" } as ItemInterface,
  { name: "Oracle" } as ItemInterface,
]);

const editModeFlag = ref(false);

const iconNames = ['material-symbols:edit-square-outline-rounded', 'material-symbols:edit-square-rounded']
const iconName = ref(iconNames[0]||'')

function itemChanged(index: number, newName: string) {
  console.log('itemChanged index, newName: ', index, newName);
  if (0 <= index && index < items.length && items[index] && Object.hasOwn(items[index], 'name')) {
    items[index].name = newName;
  }
}

function toggleEditMode() {
  editModeFlag.value = !editModeFlag.value;
  toggleIconName(iconName, iconNames);
}
function toggleIconName(iconName: Ref<string|undefined>, iconNames: string[]) {
  const newIndex = editModeFlag.value ? 1 : 0;
  iconName.value = iconNames[newIndex] || '';
}

const itemsWithProbabilities = computed(() => {
  const itemList = items.map((item, index) => {
    const probability = getCellProbabilityFromIndex(index) || 0;
    return {...item, probability, probAsPercentage: (100*probability/81).toPrecision(3)};
  })
  itemList.sort((a, b) => b.probability - a.probability);
  return itemList;
})

</script>

<template>
  <div class="triangle-page">
    <div class="triangle-table">
      <TriangleTable :items="items" :edit-mode="editModeFlag" @item-changed="itemChanged"/>
      <Icon class="edit-mode" :name="iconName ||''" @click="toggleEditMode"/>
    </div>
    <div>
      <h2>Table of probabilities</h2>
      <div class="items-list">
        <div class="col-header">Name</div><div class="col-header">Probability</div><div class="col-header">Probability<br>(%)</div>
        <template v-for="(item, index) of itemsWithProbabilities" :key="`item-${index}`">
          <div>{{ item.name }}</div>
          <div>{{ item.probability }} in 81</div>
          <div>{{ item.probAsPercentage }}%</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>

h2 { text-align: center; }

div.triangle-page {
  margin: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 1rem;
}

div.triangle-table {
  display: flex;
  flex-direction: row;
  position: relative;
}

div.items-list {
  width: 40vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

@media (max-width: 800px) {
  div.items-list {
    width: 50vw;
  }
}

div.col-header {
  font-weight: bold;
}


div.items-list div {
  text-align: center;
}
div.items-list div:nth-child(3n-2) {
  text-align: right;
}

</style>
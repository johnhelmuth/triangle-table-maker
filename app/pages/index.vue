<script setup lang="ts">

import {getCellProbabilityFromIndex} from "~/utils/triangle-table-utils";
import useTableItems from "~/composables/use-table-items";

const {itemList, getItemList, saveItemList, resetItemList} = useTableItems();

onMounted(() => {
  getItemList();
})

const editModeFlag = ref(false);

const iconNames = ['material-symbols:edit-square-outline-rounded', 'material-symbols:edit-square-rounded']
const iconName = ref(iconNames[0]||'')

function itemChanged(index: number, newName: string) {
  if (0 <= index && index < itemList.items.length && itemList.items[index] && Object.hasOwn(itemList.items[index], 'name')) {
    itemList.items[index].name = newName;
    saveItemList();
  }
}

function titleChanged(newTitle: string) {
  itemList.title = newTitle;
  saveItemList();
}

function toggleEditMode() {
  editModeFlag.value = !editModeFlag.value;
  toggleIconName(iconName, iconNames);
}
function toggleIconName(iconName: Ref<string|undefined>, iconNames: string[]) {
  const newIndex = editModeFlag.value ? 1 : 0;
  iconName.value = iconNames[newIndex] || '';
}
function clearItems() {
  itemList.items.splice(0, itemList.items.length);
  saveItemList();
}

function resetToDefault() {
  resetItemList();
  saveItemList();
}

const itemsWithProbabilities = computed(() => {
  const localItems = itemList.items.map((item, index) => {
    const probability = getCellProbabilityFromIndex(index) || 0;
    const probAsPercentage = (100*probability/itemList.probabilityMax).toPrecision(3)
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
    const percentage = (100.0*item.probability/itemList.probabilityMax);
    upperThreshold = lowerThreshold + percentage;
    if (index === itemList.items.length - 1) {
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
  <div class="triangle-page">
    <div class="triangle-table">
      <TriangleTable
          :title="itemList.title"
          :items="itemList.items"
          :edit-mode="editModeFlag"
          @item-changed="itemChanged"
          @title-changed="titleChanged"
      />
      <div class="triangle-actions-container">
        <Icon class="edit-mode" :name="iconName ||''" @click="toggleEditMode"/>
        <Icon class="clear-action" name="material-symbols:delete-outline-rounded" @click="clearItems"/>
        <Icon class="reset-to-default-action" name="material-symbols:clock-loader-60-sharp" @click="resetToDefault"/>
      </div>
    </div>
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
  </div>
</template>

<style scoped>

h2 { text-align: center; }

div.triangle-page {
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

div.triangle-table div.triangle-actions-container {
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  font-size: 1.25rem;
}

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
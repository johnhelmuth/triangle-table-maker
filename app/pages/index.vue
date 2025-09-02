<script setup lang="ts">

import useTableItems from "~/composables/use-table-items";
import ProbabilityTable from "~/components/probability-table.vue";

const {
  itemList,
  saveItemList,
  createNewItemList,
  itemListDirectory,
  loadItemListByUuid,
  deleteItemList
} = useTableItems();

const editModeFlag = ref(false);
const showSelectorFlag = ref(false);

const iconNames = ['material-symbols:edit-square-outline-rounded', 'material-symbols:edit-square-rounded']
const iconName = ref(iconNames[0] || '')

function itemChanged(index: number, newName: string) {
  if (0 <= index && index < itemList.items.length &&
      itemList.items[index] && Object.hasOwn(itemList.items[index], 'name')
  ) {
    itemList.items[index].name = newName;
    saveItemList();
  }
}

function titleChanged(evt: FocusEvent) {
  itemList.title = (evt.target as HTMLElement).innerText;
  saveItemList();
}

function toggleEditMode() {
  editModeFlag.value = !editModeFlag.value;
  toggleIconName(iconName, iconNames);
}

function toggleIconName(iconName: Ref<string | undefined>, iconNames: string[]) {
  const newIndex = editModeFlag.value ? 1 : 0;
  iconName.value = iconNames[newIndex] || '';
}

function addNewList() {
  createNewItemList();
}

function showTableList() {
  showSelectorFlag.value = !showSelectorFlag.value;
}

function closeTableSelector() {
  showSelectorFlag.value = false;
}

function selectList(uuid: string): void {
  loadItemListByUuid(uuid);
}

function deleteList(uuid: string): void {
  deleteItemList(uuid)
}

</script>

<template>
  <div class="triangle-page" :class="editModeFlag ? 'editing' : ''">
    <h2 :contenteditable="editModeFlag ? 'plaintext-only' : false" @blur="titleChanged">
      {{ itemList.title }}
    </h2>
    <div class="triangle-table">
      <TriangleTable
          :items="itemList.items"
          :edit-mode="editModeFlag"
          @item-changed="itemChanged"
      />
      <div class="triangle-actions-container">
        <Icon class="action-icon edit-mode" :name="iconName ||''" @click="toggleEditMode"/>
        <Icon class="action-icon add-new-list-action" name="mdi:table-add" @click="addNewList"/>
        <!--        <Icon class="reset-to-default-action" name="material-symbols:clock-loader-60-sharp" @click="resetToDefault"/>-->
        <Icon v-if="itemListDirectory.entries.length" class="action-icon table-selector-dropdown"
              name="material-symbols:arrow-drop-down-rounded" @click="showTableList"/>
        <RandomTableSelector
            class="random-table-selector" :item-list-directory="itemListDirectory" :show="showSelectorFlag"
            @close-selector="closeTableSelector"
            @item-list-selected="selectList"
            @delete-list="deleteList"
        />
      </div>
    </div>
    <ProbabilityTable :itemList="itemList"/>
  </div>
</template>

<style scoped>

h2 {
  text-align: center;
  padding: 0.5rem;
}

h2:not([contenteditable="false"]), h2[contenteditable="plaintextonly"] {
  box-shadow: inset -2px -2px 5px grey,
  inset 1px 1px 5px lightgrey;
}
h2:not([contenteditable="false"]):focus, h2[contenteditable="plaintextonly"]:focus {
  background-color: hsl(180deg, 0%, 90%)
}

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

div.random-table-selector {
  border: 1px solid black;
  position-anchor: --table-selector-button;
  position: absolute;
  top: calc(anchor(bottom) - 5px);
  right: calc(anchor(right));
  box-shadow: 3px 2px 5px grey;
  background-color: white;
  padding: 0.5rem;
}

.table-selector-dropdown {
  anchor-name: --table-selector-button;
}

.action-icon {
  font-size: 1.5rem;
}
</style>
<script setup lang="ts">

import useTableItems from "~/composables/use-table-items";
import ProbabilityTable from "~/components/probability-table.vue";
import {isItemList} from "~/models/RandomItemList"

const route = useRoute();

const {
  itemListDirectory,
  getItemList,
  saveItemList,
  createNewItemList
} = useTableItems();

const itemList = computed(() => getItemList(route.params?.listId && typeof route.params?.listId === 'string' ? route.params.listId : ''));

const editModeFlag = ref(false);
const showSelectorFlag = ref(false);

const iconNames = ['material-symbols:edit-square-outline-rounded', 'material-symbols:edit-square-rounded']
const iconName = ref(iconNames[0] || '')

function itemChanged(index: number, newName: string) {
  if (isItemList(itemList.value)) {
    if (0 <= index && index < itemList.value.items.length &&
        itemList.value.items[index] && Object.hasOwn(itemList.value.items[index], 'name')
    ) {
      itemList.value.items[index].name = newName;
      saveItemList(itemList.value);
    }
  }
}

function titleChanged(evt: FocusEvent) {
  if (isItemList(itemList.value)) {
    itemList.value.title = (evt.target as HTMLElement).innerText;
    saveItemList(itemList.value);
  }
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
  const newIL = createNewItemList();
  if (newIL) {
    navigateTo({
      name: 'table-listId',
      params: {
        listId: newIL.uuid
      }
    });
  }
}

function showTableList() {
  showSelectorFlag.value = !showSelectorFlag.value;
}

function closeTableSelector() {
  showSelectorFlag.value = false;
}

</script>

<template>
  <div v-if="itemList" class="triangle-page" :class="{ editing: editModeFlag}">
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
        <Icon class="action-icon edit-mode" :name="iconName ||''" title="Edit the table." @click="toggleEditMode"/>
        <Icon class="action-icon add-new-list-action" name="mdi:table-add" title="Add new table." @click="addNewList"/>
        <Icon class="action-icon table-selector-dropdown"
              name="material-symbols:arrow-drop-down-rounded" title="Select different table." @click="showTableList"/>
        <RandomTableSelector
            :item-list-directory="itemListDirectory"
            class="random-table-selector"
            :active-list="itemList.uuid"
            :show="showSelectorFlag"
            @close-selector="closeTableSelector"
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
  justify-content: start;
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
  position: fixed;
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
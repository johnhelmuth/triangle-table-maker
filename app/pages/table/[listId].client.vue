<script setup lang="ts">

import useTableItems from "~/composables/use-table-items";
import ProbabilityTable from "~/components/probability-table.vue";
import {isItemList} from "~/models/RandomItemList";
import {
  convertTableToCSV,
  convertTableToMarkdown,
  convertTableToPDF,
  sendDataAsURL,
  sendDataWithDataURL
} from "~/utils/import-export-utils";
import {titleToSlug} from "../../utils/import-export-utils";

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
const showMenuFlag = ref(false);

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

function toggleMenu() {
  showMenuFlag.value = !showMenuFlag.value;
}

function closeMenu() {
  showMenuFlag.value = false;
}

function exportTableAsJSON() {
  if (itemList.value) {
    const text = JSON.stringify(itemList.value);
    sendDataAsURL(text, titleToSlug(itemList.value?.title || 'triangle-table') + '.json', 'application/json');
  }
  closeMenu();
}

function exportTableAsMarkdown() {
  if (itemList.value) {
    const markdownTable = convertTableToMarkdown(itemList.value);
    sendDataAsURL(markdownTable, titleToSlug(itemList.value?.title || 'triangle-table') + '.md', 'text/markdown');
  }
  closeMenu();
}

function exportTableAsCSV() {
  if (itemList.value) {
    const csvTable = convertTableToCSV(itemList.value);
    sendDataAsURL(csvTable, titleToSlug(itemList.value?.title || 'triangle-table') + '.csv', 'text/csv');
  }
  closeMenu();
}

function exportTableAsPDF() {
  if (itemList.value) {
    const pdfTable = convertTableToPDF(itemList.value);
    console.log('exportTableAsPDF()', pdfTable);
    sendDataWithDataURL(pdfTable, titleToSlug(itemList.value?.title || 'triangle-table') + '.pdf');
  }
}

function copyTableAsJSON() {
  if (itemList.value) {
    const text = JSON.stringify(itemList.value);
    navigator.clipboard.writeText(text);
  }
  closeMenu();
}

function copyTableAsMarkdown() {
  if (itemList.value) {
    const markdownTable = convertTableToMarkdown(itemList.value);
    navigator.clipboard.writeText(markdownTable);
  }
  closeMenu();
}

function copyTableAsCSV() {
  if (itemList.value) {
    const csvTable = convertTableToCSV(itemList.value);
    navigator.clipboard.writeText(csvTable);
  }
  closeMenu();
}

</script>

<template>
  <div v-if="itemList" class="triangle-page" :class="{ editing: editModeFlag}">
    <h2 :contenteditable="editModeFlag ? 'plaintext-only' : false" @blur="titleChanged">
      {{ itemList.title }}
    </h2>
    <div class="triangle-table">
      <TriangleTable
          :item-list="itemList"
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
        <Icon
            class="action-icon dot-menu"
            name="mdi:dots-vertical"
            title="Table menu"
            @click="toggleMenu"
        />
        <ul class="table-menu" :class="{show: showMenuFlag}" @mouseleave="closeMenu">
          <li @click="exportTableAsJSON">Export as JSON</li>
          <li @click="exportTableAsMarkdown">Export as Markdown</li>
          <li @click="exportTableAsCSV">Export as CSV</li>
          <li @click="exportTableAsPDF">Export as PDF</li>
          <li><hr></li>
          <li @click="copyTableAsJSON">Copy as JSON</li>
          <li @click="copyTableAsMarkdown">Copy as Markdown</li>
          <li @click="copyTableAsCSV">Copy as CSV</li>
        </ul>
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
  z-index: 750;
}

.table-selector-dropdown {
  anchor-name: --table-selector-button;
}

.action-icon {
  font-size: 1.5rem;
}

.table-menu {
  display: none;
  margin: 0;
}

.table-menu.show {
  display: block;
  position: fixed;
  position-anchor: --table-menu-icon;
  top: anchor(bottom);
  right: calc(anchor(right));
  box-shadow: 3px 2px 5px grey;
  background-color: white;
  padding-left: 0;
  list-style: none;
  font-size: 0.8rem;
  z-index: 750;
}

.table-menu li {
  cursor: pointer;
  height: 1rem;
  padding: 0.5rem 0.5rem;
}
.table-menu li:hover {
  background-color: hsl(0, 0%, 90%);
}

.action-icon.dot-menu {
  anchor-name: --table-menu-icon
}

</style>
<script setup lang="ts">

import {dateFormat} from "~/utils/date-time.client";
import type {ItemListDirListInterface} from "~/models/RandomItemList";
const { isActive } = useTableItems();

const props = defineProps<{
  itemListDirectory: ItemListDirListInterface,
  show?: boolean;
}>();

const emit = defineEmits<{
  closeSelector: () => void,
  itemListSelected: (uuid: string) => void,
  deleteList: (uuid: string) => void,
}>();

function mouseLeave() {
  emit('closeSelector')
}
function elementHasUuid(el: HTMLElement) {
  return el && 'uuid' in el.dataset && typeof el.dataset.uuid === 'string';
}

function itemListSelected(evt: MouseEvent) {
  const uuidOwner = (evt.target as HTMLElement).closest('[data-uuid]') as HTMLElement;
  if (elementHasUuid(uuidOwner) && ! isActive(uuidOwner.dataset.uuid as string)) {
    emit('itemListSelected', uuidOwner.dataset.uuid as string);
  }
  emit('closeSelector')
}

function deleteItemList(evt: MouseEvent) {
  const uuidOwner = (evt.target as HTMLElement).closest('[data-uuid]') as HTMLElement;
  if (elementHasUuid(uuidOwner) && ! isActive(uuidOwner.dataset.uuid as string)) {
    emit('deleteList', uuidOwner.dataset.uuid as string);
  }
  emit('closeSelector')
}

</script>

<template>

  <div
      v-if="itemListDirectory.entries.length" class="table-selector"
      :class="false || show ? 'show-table' : '' "
       @mouseleave="mouseLeave">
    <div class="note">Select random table to load.</div>
    <div class="head-container">
      <div class="table-title selector-head">Title</div>
      <div class="table-last-updated selector-head">Last Updated</div>
      <div class="table-actions selector-head">&nbsp;</div>
    </div>
    <div
        v-for="dirEntry of itemListDirectory.entries" :key="dirEntry.uuid" class="entry-container"
         :class="isActive(dirEntry.uuid) ? '' : 'active'" :data-uuid="dirEntry.uuid">
      <div class="table-title" @click="itemListSelected">{{ dirEntry.title }}</div>
      <div class="table-last-updated" @click="itemListSelected">{{ dateFormat(new Date(dirEntry.lastUpdated)) }}</div>
      <div class="table-actions">
        <Icon
            v-if="itemListDirectory.entries.length && ! isActive(dirEntry.uuid)"
            class="action-icon table-entry-delete"
            name="material-symbols:delete-forever-outline-rounded"
            @click="deleteItemList"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

div.table-selector {
  display: none;
  grid-template-columns: minmax(1fr, auto) minmax(1fr, auto) 1rem;
  column-gap: 1rem;
  row-gap: 0.5rem;
}

div.table-selector.show-table {
  display: grid;
}

div.table-selector div.note {
  text-align: center;
  grid-column: 1 / 4;
}

div.table-selector div.entry-container, div.table-selector div.head-container {
  display: grid;
  grid-column: 1 / 4;
  grid-template-columns: subgrid;
}

div.table-selector div.selector-head {
  font-weight: bold;
  text-align: center;
}

div.table-selector div.table-title {
  text-align: right;
  grid-column: 1 / 2;
}

div.table-selector div.table-last-updated {
  text-align: left;
  grid-column: 2 / 3;
}

div.table-selector div.table-actions {
  text-align: left;
  grid-column: 3 / 4;
}

div.table-selector div.entry {
  padding: 0.25rem;
}
div.table-selector div.entry-container {
  color: grey;
}
div.table-selector div.entry-container.active {
  color: black;
}
div.table-selector div.entry-container.active .table-title:hover,
div.table-selector div.entry-container.active .table-last-updated:hover {
  cursor: pointer;
  text-decoration: underline;
}

</style>
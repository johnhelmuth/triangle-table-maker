<script setup lang="ts">

import type {ItemListDirListInterface} from "~/models/RandomItemList";

defineProps<{
  activeList?: string;
  itemListDirectory: ItemListDirListInterface;
  show?: boolean;
}>();

const emit = defineEmits<{
  closeSelector: [],
}>();

function mouseLeave() {
  emit('closeSelector')
}

</script>

<template>

  <div class="table-selector" :class="show ? 'show-table' : '' " @mouseleave="mouseLeave">
    <div class="note">Select table list to load. Click the trash can to delete a table list.</div>
    <RandomTableList :item-list-directory="itemListDirectory" :active-list="activeList"/>
  </div>

</template>

<style scoped>

div.table-selector {
  display: none;
}

div.table-selector.show-table {
  display: grid;
  padding: 1rem;
}

div.table-selector div.note {
  text-align: center;
  font-size: 1rem;
}

div.table-selector.show-table ul {
  width: 100%;
}

</style>
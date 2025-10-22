<script setup lang="ts">

import useTableItems from "~/composables/use-table-items";

const {
  itemListDirectory,
  deleteItemList,
} = useTableItems();

defineProps<{
  activeList?: string;
}>();

</script>

<template>
  <ul v-if="itemListDirectory.entries.length" class="list-container">
    <li class="list-header">
      <span class="list-title list-header">Title</span>
      <span class="list-last-updated list-header">Last Updated</span>
      <span class="list-actions list-header">&nbsp;</span>
    </li>
    <li v-for="entry in itemListDirectory.entries" :key="entry.uuid" class="list-entry">
      <NuxtLink :to="{ name: 'table-listId', params: { listId: entry.uuid}}" class="list-link">
        <span class="list-title">{{ entry.title }}</span>
        <span class="list-last-updated">{{ dateFormat(new Date(entry.lastUpdated)) }}</span>
      </NuxtLink>
      <span class="list-actions">
        <button
            v-if="itemListDirectory.entries.length > 1 && (! activeList || activeList !== entry.uuid)"
            class="action-icon table-entry-delete"
            title="Delete this list from storage."
            type="button"
            aria-description="Delete this list from storage"
            @click="deleteItemList(entry.uuid)"
        >
          <Icon
              name="material-symbols:delete-forever-outline-rounded"
              aria-hidden="true"
          />
        </button>
        <button v-else class="action-icon table-entry-delete" aria-hidden="true">&nbsp;</button>
        <NuxtLink
            v-if="itemListDirectory.entries.length > 1 && (! activeList || activeList !== entry.uuid)"
            :to="{ name: 'table-listId', params: { listId: entry.uuid}}"
            target="_blank"
            title="Open in new window or tab.">
          <Icon name="mdi:external-link"/>
        </NuxtLink>
      </span>
    </li>
  </ul>
  <p v-else>No triangle tables.</p>
</template>

<style scoped>

ul.list-container {
  width: 75cqw;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: minmax(12rem, max-content) 12rem 5rem;
  row-gap: 0.5rem;
  font-size: 1.25rem;
}

ul.list-container li.list-header {
  font-weight: bold;
}

ul.list-container li.list-entry, ul.list-container li.list-header {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  align-items: center;
}

ul.list-container li.list-entry a.list-link {
  text-decoration: none;
  color: inherit;
  grid-column: 1 / -2;
  display: grid;
  grid-template-columns: subgrid;
  column-gap: 1rem;
}

ul.list-container li.list-entry a.list-link.router-link-active {
  cursor: inherit;
}

ul.list-container li.list-entry  a.list-link:hover {
  background-color: lightgray;
}

ul.list-container li.list-entry  a.list-link.router-link-active {
  background-color: inherit;
}

ul.list-container li.list-entry a.list-link > * {
  align-self: center;
}

ul.list-container li.list-entry span.list-last-updated {
  font-size: 1rem;
}

ul.list-container li.list-entry span.list-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-left: 1rem;
  row-gap: 0.5rem;
}

ul.list-container li.list-entry span.list-actions > * {
  width: 1rem;
}

ul.list-container li.list-entry span.list-actions button.action-icon {
  border: none;
  background: none;
  width: 1.5rem;
  padding: 0;
  cursor: pointer;
}

ul.list-container li.list-entry span.list-actions button.action-icon:hover {
  background-color: lightgrey;
}

ul.list-container li.list-entry:has(a.list-link.router-link-active) span.list-actions button.action-icon:hover {
  background-color: inherit;
  cursor: default;
}

ul.list-container li.list-entry span.list-actions button.action-icon > .iconify {
  width: 1.25rem;
  height: 1.25rem;
}

ul.list-container li.list-entry span.list-actions > .table-entry-delete {

}
</style>
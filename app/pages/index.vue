<script setup lang="ts">

import useTableItems from "~/composables/use-table-items";

const {
  itemListDirectory,
  createNewItemList,
  resetToDefault
} = useTableItems();

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

function resetDirectory() {
  if (confirm("Are you sure you want to reset this list? All changes will be removed.")) {
    resetToDefault();
  }
}

</script>

<template>
  <div class="container">
    <h2>List of triangle tables</h2>
    <div class="note">Select table list to load. Click the trash can to delete a table list.</div>
    <RandomTableList :item-list-directory="itemListDirectory" class="table-list"/>
    <div class="directory-actions">
      <div>
        <button class="action-button" type="button" @click="addNewList">
          <Icon
              class="action-icon add-new-list-action"
              name="mdi:table-add"
              title="Add new table."
          />
          <label>Add new table</label>
        </button>
      </div>
      <div>
        <button class="action-button" type="button" @click="resetDirectory">
          <Icon
              class="reset-to-default-action"
              name="material-symbols:clock-loader-60-sharp"
          />
          <label>Reset to default<br>list of tables.</label>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

h2 {
  text-align: center;
}

div.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  row-gap: 1rem;
}

ul.table-list {
  width: fit-content;
}

@media (max-width: 900px) {
  ul.table-list {
    width: 100%;
  }
}

.directory-actions {
  margin-top: 1rem;
  width: 40rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  font-size: 1.5rem;
}

button.action-button:hover {
  background-color: lightgrey;
}
button.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

button.action-button, button.action-button > * {
  cursor: pointer;
}

button.action-button > * {
  width: 2rem;
  height: 2rem;
  text-align: center;
}

button.action-button > label {
  width: max-content;
  text-align: center;
  font-size: 1rem;
  margin-top: 0.5rem;
}

</style>
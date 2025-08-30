<script setup lang="ts">

export interface ItemInterface {
  name: string;
}
const props = defineProps<{
  items: Array<ItemInterface>
}>();

const itemsPerRow = 5;
const rowsPerTable = 5;

const tableRows = computed(() => {
  const rows = [] as Array<Array<ItemInterface>>;
  let row = [] as Array<ItemInterface>;
  let rowCols = 4;
  let cols = rowCols;
  for( const item of props.items) {
    row.push(item);
    if (cols < 1) {
      rows.push(row);
      row = [] as Array<ItemInterface>;
      rowCols--;
      cols = rowCols;
    } else {
      cols--;
    }
  }
  return rows;
});

</script>

<template>

  <table>
    <thead>
    <tr class="columns-label">
      <th class="not-there">&nbsp;</th>
      <th colspan="5"># of pluses (+)</th>
    </tr>
    <tr class="column-headers">
      <th class="rows-label"># of<br>minuses (-)</th>
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(rowItems, rowIndex) in tableRows" :key="rowIndex">
      <td class="row-headers">{{ rowIndex }}</td>
      <td v-for="(item, itemIndex) in rowItems" :key="(rowIndex + ':' + itemIndex)">{{ item.name }}</td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped>

table {
  border-collapse: collapse;
}

tr.columns-label th {
  font-style: italic;
}

tr.column-headers th.rows-label {
  font-style: italic;
}

td.row-headers {
  text-align: center;
  font-weight: bold;
}

th, td {
  padding: 0.5rem;
  border: 1px solid black;
}

.not-there {
  border: none;
}
</style>
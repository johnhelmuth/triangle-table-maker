<script setup lang="ts">

import {getCellProbability} from "~/utils/triangle-table-utils";

export interface ItemInterface {
  name: string;
  index?: number;
  probability?: number;
}

const props = defineProps<{
  items: Array<ItemInterface>,
  editMode?: boolean,
}>();

const emit = defineEmits<{
  itemChanged: [index: number, name: string]
}>();

/**
 * @var tableRows ComputedRef<ItemInterface[][]>
 *   Converts the simple list of names from the items property into a list of rows, each with a list of the appropriate
 *   number of names to build out the Triangle Table.
 */
const tableRows = computed(() => {
  const rows = [] as Array<Array<ItemInterface>>;
  let row = [] as Array<ItemInterface>;
  let rowCols = 4;
  let cols = rowCols;
  let index = 0;
  for( const item of props.items) {
    row.push({...item,
      index,
      probability: getCellProbability(4-rowCols, rowCols-cols),
    });
    index++;
    if (cols < 1) {
      rows.push(row);
      row = [] as Array<ItemInterface>;
      rowCols--;
      cols = rowCols;
    } else {
      cols--;
    }
  }
  if (row.length) {
    rows.push(row);
  }
  return rows;
});

function logCellChange(evt: InputEvent) {
  console.log(evt);
  const el = evt.target as HTMLElement;
  if (el && el?.dataset && 'innerText' in el &&
      Object.hasOwn(el.dataset, 'row') &&
      Object.hasOwn(el.dataset, 'col')
  ) {
    const rowIndex = parseInt(el.dataset?.row);
    const itemIndex = parseInt(el.dataset?.col);
    const newName = el.innerText
    if (! isNaN(rowIndex) && ! isNaN(itemIndex)) {
      if (tableRows.value?.[rowIndex]?.[itemIndex] !== undefined) {
        const item = tableRows.value?.[rowIndex]?.[itemIndex];
        if (item?.index !== undefined) {
          item.name = newName;
          console.log('logCellChange() item: ', item);
          emit('itemChanged', item.index, newName);
        }
      }
    }
  }
}

</script>

<template>

  <table :class="editMode ? 'editing' : null">
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
      <td v-for="(item, itemIndex) in rowItems" :key="(rowIndex + ':' + itemIndex)" :data-probability="item.probability">
        <span
            :name="(`cell-name-${rowIndex}-${itemIndex}`)"
            :data-row="rowIndex"
            :data-col="itemIndex"
            :contenteditable="editMode ? 'plaintext-only' : false"
            @blur="logCellChange"
        >
          {{ item.name }}
        </span>
        <div class="hover-block">
          {{ item.probability + ' / 81' }}<br>{{ (((item.probability || 0) / 81) * 100).toPrecision(3) + '%' }}
        </div>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped>

table {
  border-collapse: collapse;
  anchor-name: --triangle-table;
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

td[data-probability] {
  height: 3rem;
  position: relative;
  text-align: center;
}

.not-there {
  border: none;
}

td[data-probability] .hover-block {
  display: none;
  position:absolute;
  top: 1.5rem;
  left: 2rem;
  height: 2.8rem;
  line-height: 1.4rem;
  background-color: white;
  width: calc(100% - 1rem);
  padding: 0;
  font-family: sans-serif;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  border: 1px solid grey;
  box-shadow: 1px 1px 1px grey;
  z-index: 500;
}
table td[data-probability]:hover .hover-block {
  display: block;
}
table.editing td[data-probability]:hover .hover-block {
  display: none;
}

table td[data-probability="1"] {
  background-color: hsla(120 50% 95.83% / 1);
}

table td[data-probability="4"] {
  background-color: hsla(120 50% 81.67% / 1);
}

table td[data-probability="6"] {
  background-color: hsla(120 50% 70% / 1);
}

table td[data-probability="12"] {
  background-color: hsla(120 50% 45% / 1);
}

</style>
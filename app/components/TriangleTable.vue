<script setup lang="ts">

import {probabilityDisplayType, type ProbabilityDisplayTypesType} from "~/utils/TriangleTableTypes";

export interface ItemInterface {
  name: string;
  probability?: number;
}

const props = defineProps<{
  items: Array<ItemInterface>,
  showProbabilitiesAs?: ProbabilityDisplayTypesType,
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
  for( const item of props.items) {
    row.push({...item, probability: getCellProbability(4-rowCols, rowCols-cols)});
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

const probabilityClass = computed(() => {
  switch (props.showProbabilitiesAs || probabilityDisplayType.None) {
    case probabilityDisplayType.Color:
      return 'probability-in-color';
    case probabilityDisplayType.Hover:
      return 'probability-in-hover';
    case probabilityDisplayType.None:
    default:
      return false;
  }
})

/**
 * @var probabilityForTable {number[][]}
 * 
 * The number out of 81 that a given table cell represents.
 */
const probabilityForTable = [
    [1, 4, 6, 4, 1],
    [4, 12, 12, 4],
    [6, 12, 6],
    [4, 4],
    [1],
] as Array<Array<number>>;

function getCellProbability(rowIndex: number, itemIndex: number) {
  if (probabilityForTable[rowIndex] !== undefined) {
    if (probabilityForTable[rowIndex][itemIndex] !== undefined) {
      return probabilityForTable[rowIndex][itemIndex];
    }
  }
}

</script>

<template>

  <table :class="probabilityClass">
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
        {{ item.name }}
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

table.probability-in-color td[data-probability="1"] {
  background-color: hsla(120 50% 95.83% / 1);
}

table.probability-in-color td[data-probability="4"] {
  background-color: hsla(120 50% 81.67% / 1);
}

table.probability-in-color td[data-probability="6"] {
  background-color: hsla(120 50% 72.5% / 1);
}

table.probability-in-color td[data-probability="12"] {
  background-color: hsla(120 50% 45% / 1);
}

</style>
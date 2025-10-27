<script setup lang="ts">

import {getCellProbability} from "~/utils/triangle-table-utils";
import type {ItemInterface} from "~/models/RandomItemList";

const props = defineProps<{
  items: Array<ItemInterface>,
  editMode?: boolean,
}>();

const emit = defineEmits<{
  itemChanged: [index: number, name: string],
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
  for (const item of props.items) {
    row.push({
      ...item,
      index,
      probability: getCellProbability(4 - rowCols, rowCols - cols),
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
  const el = evt.target as HTMLElement;
  if (el && el?.dataset && 'innerText' in el &&
      Object.hasOwn(el.dataset, 'row') &&
      Object.hasOwn(el.dataset, 'col')
  ) {
    const dataSet = el.dataset as { row: string; col: string; };
    const rowIndex = parseInt(dataSet.row);
    const itemIndex = parseInt(dataSet.col);
    const newName = el.innerText.trim();
    if (!isNaN(rowIndex) && !isNaN(itemIndex)) {
      if (tableRows.value?.[rowIndex]?.[itemIndex] !== undefined) {
        const item = tableRows.value?.[rowIndex]?.[itemIndex];
        if (item?.index !== undefined) {
          item.name = newName;
          emit('itemChanged', item.index, newName);
        }
      }
    }
  }
}

</script>

<template>
  <div class="triangle-table-wrapper">
    <div class="triangle-table-container" :class="editMode ? 'editing' : null">
      <div class="col-msg"># of pluses (+)</div>

      <div class="row-msg"># of minuses (-)</div>
      <div class="col-head col-head0">0</div>
      <div class="col-head col-head1">1</div>
      <div class="col-head col-head2">2</div>
      <div class="col-head col-head3">3</div>
      <div class="col-head col-head4">4</div>
      <template v-for="(rowItems, rowIndex) in tableRows" :key="rowIndex">
        <div class="row-head" :class="[`row-head${rowIndex}`]">{{ rowIndex }}</div>
        <template v-for="(item, itemIndex) in rowItems" :key="(rowIndex + ':' + itemIndex)">
          <div
              class="cell"
              :class="[`cell-${rowIndex}${itemIndex}`]"
              :data-probability="item.probability"
              :data-name="(`cell-name-${rowIndex}-${itemIndex}`)"
              :data-row="rowIndex"
              :data-col="itemIndex"
              :contenteditable="editMode ? 'plaintext-only' : false"
              @blur="logCellChange"
          >
            <div class="item-value">{{ (item.name || " ") }}</div>
            <div class="hover-block">
              {{ item.probability + ' in 81' }}<br>{{ (((item.probability || 0) / 81) * 100).toPrecision(3) + '%' }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>

</template>

<style scoped>

.triangle-table-wrapper {
  display: flex;
  flex-direction: column;
}

h2 {
  text-align: center;
}

.triangle-table-container {
  color: black;
  display: grid;
  grid-template-columns: 7rem repeat(5, 8.5rem);
  grid-template-areas:
      ".            colmsg    colmsg    colmsg  colmsg  colmsg"
      "rowmsg       col-head0  col-head1  col-head2  col-head3  col-head4"
      "row-label0   cell-00    cell-01    cell-02    cell-03    cell-04"
      "row-label1   cell-10    cell-11    cell-12    cell-13    ."
      "row-label2   cell-20    cell-21    cell-22    .          ."
      "row-label3   cell-30    cell-31    .          .          ."
      "row-label4   cell-40    .          .          .          .";
  grid-template-rows: 3rem 4rem repeat(5, fit-content(3.5rem));
}

.triangle-table-container > div {
  border-right: 1px black solid;
  border-bottom: 1px black solid;
  border-top: none;
  border-left: none;
  padding: 0.5rem;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--background-color-middle-1)
}

.triangle-table-container > div.col-msg {
  grid-area: colmsg;
  text-align: center;
  font-weight: bold;
  font-style: italic;
  border-top: 1px solid black;
  border-left: 1px solid black;
}

.triangle-table-container > div.row-msg {
  grid-area: rowmsg;
  text-align: center;
  font-weight: bold;
  font-style: italic;
  border-top: 1px solid black;
  border-left: 1px solid black;
}

.col-head {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.col-head0 {
  grid-area: col-head0;
}

.col-head1 {
  grid-area: col-head1;
}

.col-head2 {
  grid-area: col-head2;
}

.col-head3 {
  grid-area: col-head3;
}

.col-head4 {
  grid-area: col-head4;
}

.triangle-table-container > div.row-head {
  text-align: center;
  font-weight: bold;
  border-left: 1px black solid;
  font-size: 1.2rem;
}

.row-head0 {
  grid-area: row-label0;
}

.row-head1 {
  grid-area: row-label1;
}

.row-head2 {
  grid-area: row-label2;
}

.row-head3 {
  grid-area: row-label3;
}

.row-head4 {
  grid-area: row-label4;
}

.cell {
  text-align: center;
  font-size: 1.2rem;
}

.cell-00 {
  grid-area: cell-00;
}

.cell-01 {
  grid-area: cell-01;
}

.cell-02 {
  grid-area: cell-02;
}

.cell-03 {
  grid-area: cell-03;
}

.cell-04 {
  grid-area: cell-04;
}

.cell-10 {
  grid-area: cell-10;
}

.cell-11 {
  grid-area: cell-11;
}

.cell-12 {
  grid-area: cell-12;
}

.cell-13 {
  grid-area: cell-13;
}

.cell-20 {
  grid-area: cell-20;
}

.cell-21 {
  grid-area: cell-21;
}

.cell-22 {
  grid-area: cell-22;
}

.cell-30 {
  grid-area: cell-30;
}

.cell-31 {
  grid-area: cell-31;
}

.cell-40 {
  grid-area: cell-40;
}

div[data-probability] {
  position: relative;
  text-align: center;
}

div[data-probability] .hover-block {
  display: none;
  position: absolute;
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

div[data-probability]:hover .hover-block {
  display: block;
}

.triangle-table-container.editing div[data-probability]:hover .hover-block {
  display: none;
}


.triangle-table-container.editing div[data-probability] {
  box-shadow: inset -2px -2px 5px grey,
  inset 1px 1px 5px lightgrey
}

.triangle-table-container.editing div[data-probability]:focus {
  background-color: var(--background-color-middle-1);
}

.triangle-table-container div[data-probability="1"] {
  background-color: var(--prob-1-bg-color);
}

.triangle-table-container div[data-probability="4"] {
  background-color: var(--prob-4-bg-color);
}

.triangle-table-container div[data-probability="6"] {
  background-color: var(--prob-6-bg-color);
}

.triangle-table-container div[data-probability="12"] {
  background-color: var(--prob-12-bg-color);
}

</style>
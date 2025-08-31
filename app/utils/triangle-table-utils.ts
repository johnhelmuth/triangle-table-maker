
export const TRIANGLE_TABLE_CELL_COUNT = 15;

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

const rowColFromIndex = [
  { rowIndex: 0, colIndex: 0 },
  { rowIndex: 0, colIndex: 1 },
  { rowIndex: 0, colIndex: 2 },
  { rowIndex: 0, colIndex: 3 },
  { rowIndex: 0, colIndex: 4 },
  { rowIndex: 1, colIndex: 0 },
  { rowIndex: 1, colIndex: 1 },
  { rowIndex: 1, colIndex: 2 },
  { rowIndex: 1, colIndex: 3 },
  { rowIndex: 2, colIndex: 0 },
  { rowIndex: 2, colIndex: 1 },
  { rowIndex: 2, colIndex: 2 },
  { rowIndex: 3, colIndex: 0 },
  { rowIndex: 3, colIndex: 1 },
  { rowIndex: 4, colIndex: 0 },
]

export function getCellProbability(rowIndex: number, colIndex: number) {
  if (probabilityForTable[rowIndex] !== undefined) {
    if (probabilityForTable[rowIndex][colIndex] !== undefined) {
      return probabilityForTable[rowIndex][colIndex];
    }
  }
}

export function getCellProbabilityFromIndex(index: number) {
  const rowCol = indexToRowCol(index);
  if (rowCol !== undefined) {
    const { rowIndex, colIndex } = rowCol;
    return getCellProbability(rowIndex, colIndex);
  }
}

export function indexToRowCol(index: number) {
  if (index >= 0 && index < rowColFromIndex.length && rowColFromIndex[index] !== undefined) {
    return rowColFromIndex[index];
  }
}

import slugify from 'slugify';
import {listToTriangle, type RandomItemListInterface} from "~/models/RandomItemList";

export function sendDataAsURL(text: string, filename: string, mimetype: string) {

  // credit: https://www.bitdegree.org/learn/javascript-download
  // credit2: https://www.raymondcamden.com/2020/12/15/vue-quick-shot-downloading-data-as-a-file
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimetype};charset=utf-8,` + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);

}

export function titleToSlug(title: string) {
  return slugify(title, { lower: true });
}

export function convertTableToMarkdown(itemList: RandomItemListInterface): string {
  const triangleList = listToTriangle(itemList);
  const CELLSPACES = 9;
  const text = [
      `***${itemList.title}***\n`,
      '|         |         |    +    |   + +   |  + + +  | + + + + |',
      '|---------|---------|---------|---------|---------|---------|'
  ];
  for(const [lineNo, row] of triangleList.items.entries()) {
    let rowText = '|';
    if (lineNo === 0) {
      rowText += '         |'
    } else {
      rowText +=
          ' '.repeat((CELLSPACES - (lineNo*2)) / 2) +
          ' -'.repeat(lineNo) +
          ' '.repeat((CELLSPACES - (lineNo*2)) / 2) +
          ' |'
    }
    rowText += row.map(item => item.name).join(' | ') + ' |';
    text.push(rowText);
  }
  return text.join('\n');
}

export function convertTableToCSV(itemList: RandomItemListInterface) : string {
  const triangleList = listToTriangle(itemList);
  const text = [
    'num_minus,0_plus,1_plus,2_plus,3_plus,4_plus'
  ];
  for(const [lineNo, row] of triangleList.items.entries()) {
    let rowText = `${lineNo},`;
    rowText += row.map(item => `"${item.name}"`).join(',');
    text.push(rowText);
  }
  return text.join('\n');
}
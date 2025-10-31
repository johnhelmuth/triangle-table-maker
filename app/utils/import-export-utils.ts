
import slugify from 'slugify';
import {listToTriangle, type RandomItemListInterface} from "~/models/RandomItemList";
import { jsPDF } from "jspdf";

export function sendDataAsURL(text: string, filename: string, mimetype: string) {
  const dataUrl = `data:${mimetype};charset=utf-8,` + encodeURIComponent(text);
  return sendDataWithDataURL(dataUrl, filename);
}

export function sendDataWithDataURL(dataURL: string, filename: string) {
  // credit: https://www.bitdegree.org/learn/javascript-download
  // credit2: https://www.raymondcamden.com/2020/12/15/vue-quick-shot-downloading-data-as-a-file
  const element = document.createElement('a');
  element.setAttribute('href', dataURL);
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

export function convertTableToPDF(itemList: RandomItemListInterface) {

  const triangleList = listToTriangle(itemList);

  const headers = [
    {
      name: 'num_minus',
      prompt: '# of minuses',
      width: 65,
      align: 'center',
      padding: 0
    },
    {
      name: '0_pluses',
      prompt: ' ',
      width: 65,
      align: 'center',
      padding: 0
    },
    {
      name: '1_plus',
      prompt: '+',
      width: 65,
      align: 'center',
      padding: 0
    },
    {
      name: '2_pluses',
      prompt: '+ +',
      width: 65,
      align: 'center',
      padding: 0
    },
    {
      name: '3_pluses',
      prompt: '+ + +',
      width: 65,
      align: 'center',
      padding: 0
    },
    {
      name: '4_pluses',
      prompt: '+ + + + ',
      width: 65,
      align: 'center',
      padding: 0
    }
  ];

  const cellRows = [];
  const headerKeys = headers.map(header => header.name)
  for(const [lineNo, row] of triangleList.items.entries()) {
    const cellRow = {
      'num_minus': lineNo ? '- '.repeat(lineNo) : ' '
    } as Record<string, string>;
    for (const [index, item] of row.entries()) {
      if (headerKeys[index+1] && typeof headerKeys[index+1] === 'string') {
        const prop = headerKeys[index+1];
        console.log('item.name: ', item.name);
        console.log('index: ', index);
        console.log('headerKeys[index+1]: ', headerKeys[index+1]);
        console.log('prop: ', prop);
        cellRow[prop] = item.name;
      }
    }
    console.log('triangle')
    console.log('headerKeys.length: ', headerKeys.length);
    console.log('lineNo: ', lineNo);
    console.log('row.length: ', row.length);
    console.log('cellRow: ', {...cellRow});
    if (headerKeys.length > row.length) {
      console.log('backfilling empty cells.');
      for (let col = row.length+1; col < headerKeys.length; col++) {
        const prop = headerKeys[col];
        cellRow[prop] = '';
      }
    }
    console.log('cellRow: ', cellRow);
    cellRows.push(cellRow);
  }
  console.log('triangleList: ', triangleList);
  console.log('headers: ', headers);
  console.log('headerKeys: ', headerKeys);
  console.log('cellRows: ', cellRows);

  const doc = new jsPDF({ putOnlyUsedFonts: true });
  doc.table(1, 1, cellRows, headers, { autoSize: true, fontSize: 10 });
  console.log('doc: ', doc);
  const uristring = doc.output('datauristring');
  console.log('uristring: ', uristring);
  return uristring;
}
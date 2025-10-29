
import slugify from 'slugify';

export function sendDataAsURL(data: any, filename: string) {

  // credit: https://www.bitdegree.org/learn/javascript-download
  // credit2: https://www.raymondcamden.com/2020/12/15/vue-quick-shot-downloading-data-as-a-file
  const text = JSON.stringify(data);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);

}


export function titleToSlug(title: string) {
  return slugify(title, { lower: true });
}
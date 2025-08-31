
export interface ItemInterface {
  name: string;
  index?: number;
  probability?: number;
  d100Range?: number[];
}

export interface RandomItemListInterface {
  title: string;
  items: ItemInterface[];
  probabilityMax: number;
}

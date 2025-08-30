
export const probabilityDisplayType = {
  None: 'None',
  Color: 'Color',
  Hover: 'Hover',
} as const;

export type ProbabilityDisplayTypesType = keyof typeof probabilityDisplayType;


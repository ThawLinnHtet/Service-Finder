export const NRC_TYPES = ["N", "E", "P"] as const;

export type NrcTypeValue = (typeof NRC_TYPES)[number];

export const NRC_TYPE_LABELS_MM: Record<NrcTypeValue, string> = {
  N: "နိုင်",
  E: "ဧည့်",
  P: "ပြု",
};

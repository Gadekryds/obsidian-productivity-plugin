
export const STATUS_LIST = ["New", "In Progress", "Done"] as const;
export type Status = typeof STATUS_LIST[number];
export type Audiences = "Any" | "Dev" | "Non Technical";

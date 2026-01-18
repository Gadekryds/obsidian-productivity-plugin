export type ProductivitySetting = SearchProductivitySetting | ToggleProductivitySetting | DropdownProductivitySetting | TextProductivitySetting;

export type SearchProductivitySetting = BaseProductivitySetting & {
    type: "search";
}

export type ToggleProductivitySetting = BaseProductivitySetting & {
    type: "toggle";
}

export type DropdownProductivitySetting = BaseProductivitySetting & {
    type: "dropdown",
    option: string[];
}

export type TextProductivitySetting = BaseProductivitySetting & {
    type: "text";
    placeholder?: string;
}

export interface BaseProductivitySetting {
    name: string;
    desc: string;
}
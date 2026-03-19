export type DemoOption = {
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
};

export const statusOptions: DemoOption[] = [
  { value: "draft", label: "Draft", color: "text-slate-500" },
  { value: "review", label: "In review", color: "text-amber-500" },
  { value: "published", label: "Published", color: "text-emerald-500" },
  { value: "archived", label: "Archived", color: "text-rose-500" }
];

export const priorityOptions: DemoOption[] = [
  { value: "low", label: "Low", color: "text-sky-500" },
  { value: "medium", label: "Medium", color: "text-amber-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "urgent", label: "Urgent", color: "text-rose-500" }
];

export const teamMemberOptions: DemoOption[] = [
  { value: "ahrorbek", label: "Ahrorbek" },
  { value: "sarah", label: "Sarah Connor" },
  { value: "david", label: "David Kim" },
  { value: "madina", label: "Madina Usmonova" },
  { value: "umar", label: "Umar Alimuhamedov" },
  { value: "zarina", label: "Zarina Karimova" }
];

export const departmentOptions: DemoOption[] = [
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "support", label: "Support" }
];

export const tagOptions: DemoOption[] = [
  { value: "svelte", label: "Svelte" },
  { value: "forms", label: "Forms" },
  { value: "demo", label: "Demo" },
  { value: "mobile", label: "Mobile" },
  { value: "analytics", label: "Analytics" },
  { value: "billing", label: "Billing" }
];

export const featureOptions: DemoOption[] = [
  { value: "notifications", label: "Notifications" },
  { value: "automation", label: "Automation" },
  { value: "insights", label: "Insights" },
  { value: "multi-tenant", label: "Multi-tenant" },
  { value: "exports", label: "Exports" }
];

export const scenarioCards = [
  {
    id: "dialog-contact",
    title: "Quick contact dialog",
    description:
      "A compact dialog form for short interactions like lead capture, support, or quick follow-ups.",
    mode: "dialog" as const
  },
  {
    id: "sheet-profile",
    title: "Profile setup sheet",
    description:
      "A longer side sheet flow for onboarding, profile setup, and multi-field editing.",
    mode: "sheet" as const
  },
  {
    id: "dialog-media",
    title: "Upload assets dialog",
    description:
      "A media-focused dialog showcasing file and image inputs in a smaller modal.",
    mode: "dialog" as const
  },
  {
    id: "sheet-schedule",
    title: "Scheduling sheet",
    description:
      "A schedule planning flow with date, time, and datetime fields inside a sheet.",
    mode: "sheet" as const
  }
] as const;

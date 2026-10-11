export const EXAM_STATUS_TONE: Record<string, "neutral" | "brand" | "success" | "warning" | "danger" | "telc"> = {
  draft: "neutral",
  generated: "telc",
  validated: "brand",
  in_review: "warning",
  approved: "brand",
  published: "success",
  superseded: "neutral",
  archived: "danger",
};

export const EXAM_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  generated: "AI generated",
  validated: "Validated",
  in_review: "In review",
  approved: "Approved",
  published: "Published",
  superseded: "Superseded",
  archived: "Archived",
};

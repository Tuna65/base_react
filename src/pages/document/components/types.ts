export const stateLabel = (state?: string | null) =>
  (
    ({
      ocr_queued: "OCR queued",
      llm_queued: "LLM queued",
      llm_failed: "LLM failed",
      completed: "Completed",
    ocr_processing: "OCR processing",
    ocr_failed: "OCR failed",
    uploaded: "Uploaded",
      ready: "Ready",
      extracted: "Extracted",
      extract_failed: "Failed",
      partial: "Partial",
    }) as Record<string, string>
  )[state ?? "uploaded"] ??
  state ??
  "Uploaded";

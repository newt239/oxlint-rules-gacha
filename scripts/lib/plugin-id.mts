const DOC_SEGMENT_TO_PLUGIN_ID: Record<string, string> = {
  jsx_a11y: "jsx-a11y",
  react_perf: "react-perf",
};

export const toPluginId = (docSegment: string): string =>
  DOC_SEGMENT_TO_PLUGIN_ID[docSegment] ?? docSegment;

const DOC_SEGMENT_TO_PLUGIN_ID: Record<string, string> = {
  jsx_a11y: "jsx-a11y",
  react_perf: "react-perf",
};

const PLUGIN_ID_TO_DOC_SEGMENT: Record<string, string> = {
  "jsx-a11y": "jsx_a11y",
  "react-perf": "react_perf",
};

export const toPluginId = (docSegment: string): string =>
  DOC_SEGMENT_TO_PLUGIN_ID[docSegment] ?? docSegment;

export const toDocSegment = (pluginId: string): string =>
  PLUGIN_ID_TO_DOC_SEGMENT[pluginId] ?? pluginId;

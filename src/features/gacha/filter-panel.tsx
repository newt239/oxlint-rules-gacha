"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { CATEGORIES, type Category, loadRuleIndex } from "#/lib/rules";
import { filterStore, usePersistedStore } from "#/lib/stores";
import { trackEvent } from "#/lib/track";
import { color, font, layout, text } from "#/styles/tokens.stylex";

const styles = stylex.create({
  details: {
    borderColor: color.cabinet2,
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    marginBlockStart: "2rem",
    padding: "1rem",
  },
  fieldset: {
    borderStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem 1rem",
    margin: 0,
    marginBlockStart: "0.75rem",
    padding: 0,
  },
  fieldsetGap: {
    marginBlockStart: "1.5rem",
  },
  label: {
    alignItems: "center",
    color: color.ink,
    display: "flex",
    fontFamily: font.mono,
    fontSize: text.md,
    gap: "0.25rem",
  },
  legend: {
    color: color.inkDim,
    fontSize: text.md,
    marginBlockEnd: "0.5rem",
    padding: 0,
  },
  summary: {
    color: color.inkDim,
    cursor: "pointer",
    fontSize: text.md,
  },
});

const toggle = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];

export const FilterPanel = () => {
  const filter = usePersistedStore(filterStore);
  const [plugins, setPlugins] = useState<string[]>([]);

  const handleToggleOpen = () => {
    if (plugins.length > 0) {
      return;
    }

    loadRuleIndex()
      .then((index) => {
        setPlugins([...new Set(index.rules.map((rule) => rule.plugin))].toSorted());
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  const toggleCategory = (category: Category) => {
    trackEvent("filter_change", {
      filter_enabled: filter.excludedCategories.includes(category),
      filter_type: "category",
      filter_value: category,
    });

    filterStore.set({
      ...filter,
      excludedCategories: CATEGORIES.filter((value) =>
        toggle(filter.excludedCategories, category).includes(value),
      ),
    });
  };

  const togglePlugin = (plugin: string) => {
    trackEvent("filter_change", {
      filter_enabled: filter.excludedPlugins.includes(plugin),
      filter_type: "plugin",
      filter_value: plugin,
    });

    filterStore.set({
      ...filter,
      excludedPlugins: toggle(filter.excludedPlugins, plugin),
    });
  };

  return (
    <details onToggle={handleToggleOpen} {...stylex.props(styles.details)}>
      <summary {...stylex.props(styles.summary)}>Filters</summary>
      <fieldset {...stylex.props(styles.fieldset)}>
        <legend {...stylex.props(styles.legend)}>Category</legend>
        {CATEGORIES.map((category) => (
          <label key={category} {...stylex.props(styles.label)}>
            <input
              checked={!filter.excludedCategories.includes(category)}
              onChange={() => {
                toggleCategory(category);
              }}
              type="checkbox"
            />
            {category}
          </label>
        ))}
      </fieldset>
      <fieldset {...stylex.props(styles.fieldset, styles.fieldsetGap)}>
        <legend {...stylex.props(styles.legend)}>Plugins</legend>
        {plugins.map((plugin) => (
          <label key={plugin} {...stylex.props(styles.label)}>
            <input
              checked={!filter.excludedPlugins.includes(plugin)}
              onChange={() => {
                togglePlugin(plugin);
              }}
              type="checkbox"
            />
            {plugin}
          </label>
        ))}
      </fieldset>
    </details>
  );
};

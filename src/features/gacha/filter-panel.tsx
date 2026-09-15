"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { loadRuleIndex } from "#/lib/rule-index-cache";
import { CATEGORIES, type Category } from "#/lib/rules";
import { filterStore } from "#/lib/stores";
import { useFilter } from "#/lib/use-draw";
import { color, font, layout } from "#/styles/tokens.stylex";

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
    fontSize: "0.75rem",
    gap: "0.25rem",
  },
  legend: {
    color: color.inkDim,
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    marginBlockEnd: "0.5rem",
    padding: 0,
    textTransform: "uppercase",
  },
  summary: {
    color: color.inkDim,
    cursor: "pointer",
    fontSize: "0.75rem",
  },
});

const toggle = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];

export const FilterPanel = () => {
  const filter = useFilter();
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
    filterStore.set({
      ...filter,
      excludedCategories: CATEGORIES.filter((value) =>
        toggle(filter.excludedCategories, category).includes(value),
      ),
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
                filterStore.set({
                  ...filter,
                  excludedPlugins: toggle(filter.excludedPlugins, plugin),
                });
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

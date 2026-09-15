"use client";

import { useState } from "react";

import { loadRuleIndex } from "#/lib/rule-index-cache";
import { CATEGORIES, type Category } from "#/lib/rules";
import { filterStore } from "#/lib/stores";
import { useFilter } from "#/lib/use-draw";

import type { Dictionary } from "#/i18n";

type FilterPanelProps = {
  dictionary: Dictionary;
};

const toggle = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];

export const FilterPanel = ({ dictionary }: FilterPanelProps) => {
  const filter = useFilter();
  const [plugins, setPlugins] = useState<string[]>([]);

  const handleToggleOpen = () => {
    if (plugins.length > 0) {
      return;
    }

    loadRuleIndex()
      .then((index) => {
        setPlugins([...new Set(index.map((rule) => rule.plugin))].toSorted());
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
    <details onToggle={handleToggleOpen}>
      <summary>{dictionary.filters}</summary>
      <fieldset>
        <legend>{dictionary.categoryLabel}</legend>
        {CATEGORIES.map((category) => (
          <label key={category}>
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
      <fieldset>
        <legend>{dictionary.plugins}</legend>
        {plugins.map((plugin) => (
          <label key={plugin}>
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

"use client";

import { useRef } from "react";

import * as stylex from "@stylexjs/stylex";

import { ActionButton } from "#/components/action-button";
import { EMPTY_COLLECTION } from "#/lib/collection";
import { collectionStore } from "#/lib/stores";
import { color, layout, text } from "#/styles/tokens.stylex";

const styles = stylex.create({
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBlockStart: "1.5rem",
  },
  dialog: {
    "::backdrop": { backgroundColor: color.scrim },
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    borderStyle: "none",
    color: color.ink,
    maxWidth: "24rem",
    padding: "1.5rem",
  },
  dialogButtons: {
    justifyContent: "flex-end",
  },
  heading: {
    fontSize: text.lg,
    marginBlock: "0 0.75rem",
  },
  note: {
    color: color.inkDim,
    fontSize: text.md,
    margin: 0,
  },
  section: {
    marginBlockStart: "3rem",
  },
});

type CollectionClearProps = {
  count: number;
};

export const CollectionClear = ({ count }: CollectionClearProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDelete = () => {
    collectionStore.set(EMPTY_COLLECTION);
    dialogRef.current?.close();
  };

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>Clear collection</h2>
      <p {...stylex.props(styles.note)}>
        Your collection lives in this browser only. Clearing it cannot be undone.
      </p>
      <div {...stylex.props(styles.buttons)}>
        <ActionButton
          disabled={count === 0}
          onClick={() => {
            dialogRef.current?.showModal();
          }}
          variant="secondary"
        >
          Clear collection
        </ActionButton>
      </div>
      <dialog
        aria-labelledby="clear-collection-title"
        closedby="any"
        ref={dialogRef}
        {...stylex.props(styles.dialog)}
      >
        <h2 id="clear-collection-title" {...stylex.props(styles.heading)}>
          Clear collection
        </h2>
        <p {...stylex.props(styles.note)}>
          Delete all {count} rules from your collection? This cannot be undone.
        </p>
        <div {...stylex.props(styles.buttons, styles.dialogButtons)}>
          <ActionButton
            onClick={() => {
              dialogRef.current?.close();
            }}
            variant="secondary"
          >
            Cancel
          </ActionButton>
          <ActionButton onClick={handleDelete} variant="primary">
            Delete
          </ActionButton>
        </div>
      </dialog>
    </section>
  );
};

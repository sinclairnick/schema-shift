import { describe, expect, test } from "vitest";
import { CaseMap, TestCases } from "./common._spec";
import { createToDef } from "../core/to-def";
import { createFromDef } from "../core/from-def";
import * as Y from "yup";
import * as Subject from "./yup";

const schemas = {
  string: Y.string(),
  boolean: Y.bool(),
  number: Y.number(),
  objects: Y.object({
    a: Y.number(),
  }),
  date: Y.date(),
  "nested objects": Y.object({
    a: Y.object({
      b: Y.object({
        c: Y.boolean(),
      }),
    }),
  }),
  nullables: Y.boolean().nullable(),
  arrays: Y.array(Y.string()),
  "nested arrays": Y.array(Y.array(Y.string())),
  tuples: Y.tuple([Y.number(), Y.boolean()]),
  enum: Y.mixed().oneOf(["A", "B"]),
} satisfies Partial<CaseMap>;

describe("TypeBox", () => {
  describe("Parser", () => {
    for (const [key, def] of TestCases) {
      const schema = schemas[key as keyof typeof schemas];
      const title = `Works with ${key}`;

      if (!schema) {
        test.skip(title);
        continue;
      }

      test(title, () => {
        expect(Subject.yupToDef(schema)).toEqual(def);
      });
    }
  });

  describe("Formatter", () => {
    for (const [key, def] of TestCases) {
      const expected = schemas[key as keyof typeof schemas];
      const title = `Works with ${key}`;

      if (!expected) {
        test.skip(title);
        continue;
      }

      test(title, () => {
        const result = Subject.yupFromDef(def);

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
      });
    }
  });
});

import { describe, expect, test } from "vitest";
import { CaseMap, TestCases } from "./common._spec";
import * as v from "valibot";
import * as Subject from "./valibot";
import { createToDef } from "../core/to-def";
import { createFromDef } from "../core/from-def";

const schemas = {
  string: v.string(),
  boolean: v.boolean(),
  number: v.number(),
  symbol: v.symbol(),
  undefined: v.undefined_(),
  date: v.date(),
  enum: v.enum_({ A: "A", B: "B" }),
  objects: v.object({
    a: v.number(),
  }),
  "nested objects": v.object({
    a: v.object({
      b: v.object({
        c: v.boolean(),
      }),
    }),
  }),
  optionals: v.optional(v.number()),
  nullables: v.nullable(v.boolean()),
  arrays: v.array(v.string()),
  "nested arrays": v.array(v.array(v.string())),
  intersections: v.intersect([v.number(), v.boolean()]),
  unions: v.union([v.number(), v.boolean()]),
  tuples: v.tuple([v.number(), v.boolean()]),
  any: v.any(),
  null: v.null_(),
} satisfies CaseMap;

describe("Valibot", () => {
  describe("Parser", () => {
    test.each(TestCases)("Works with %s", (key, def) => {
      const schema = schemas[key as keyof typeof schemas];

      expect(Subject.valibotToDef(schema)).toEqual(def);
    });
  });

  describe("Formatter", () => {
    test.each(TestCases)("Works with %s", (key, def) => {
      const result = Subject.valibotFromDef(def);
      const expected = schemas[key];

      expect(result.type).toEqual(expected.type);
      expect(result._types).toEqual(expected._types);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });
});

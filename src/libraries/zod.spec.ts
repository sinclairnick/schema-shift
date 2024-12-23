import { describe, expect, test } from "vitest";
import { CaseMap, TestCases } from "./common._spec";
import * as Subject from "./zod";
import { z } from "zod";
import { createFromDef } from "../core/from-def";
import { SchemaDef } from "../def-types/schema-def";

const schemas = {
  string: z.string(),
  boolean: z.boolean(),
  number: z.number(),
  symbol: z.symbol(),
  undefined: z.undefined(),
  date: z.date(),
  enum: z.enum(["A", "B"]),
  objects: z.object({
    a: z.number(),
  }),
  "nested objects": z.object({
    a: z.object({
      b: z.object({
        c: z.boolean(),
      }),
    }),
  }),
  optionals: z.number().optional(),
  nullables: z.boolean().nullable(),
  arrays: z.string().array(),
  "nested arrays": z.string().array().array(),
  intersections: z.intersection(z.number(), z.boolean()),
  unions: z.union([z.number(), z.boolean()]),
  tuples: z.tuple([z.number(), z.boolean()]),
  any: z.any(),
  null: z.null(),
} satisfies CaseMap;

describe("Zod", () => {
  describe("Parser", () => {
    test.each(TestCases)("Works with %s", (key, def) => {
      expect(Subject.zodToDef(schemas[key])).toMatchObject(def);
    });

    test("Supports transforms", () => {
      const schema = z.object({ a: z.number() }).transform((x) => x);
      const expected: SchemaDef = {
        type: "object",
        properties: {
          a: { type: "number" },
        },
      };

      expect(Subject.zodToDef(schema)).toMatchObject(expected);
    });

    test("Supports refines", () => {
      const schema = z.object({ a: z.number() }).refine((x) => undefined);
      const expected: SchemaDef = {
        type: "object",
        properties: {
          a: { type: "number" },
        },
      };

      expect(Subject.zodToDef(schema)).toMatchObject(expected);
    });

    test("Supports pick", () => {
      const schema = z
        .object({ a: z.number(), b: z.number() })
        .pick({ a: true });
      const expected: SchemaDef = {
        type: "object",
        properties: {
          a: { type: "number" },
        },
      };

      expect(Subject.zodToDef(schema)).toMatchObject(expected);
    });

    test("Supports passthrough", () => {
      const schema = z.object({ a: z.number() }).passthrough();

      const expected: SchemaDef = {
        type: "object",
        properties: {
          a: { type: "number" },
        },
        additionalProperties: true,
      };

      expect(Subject.zodToDef(schema)).toMatchObject(expected);
    });
  });

  describe("Formatter", () => {
    test.each(TestCases)("Works with %s", (key, def) => {
      const result = Subject.zodFromDef(def);
      const expected = schemas[key];

      // Comparing schema is hard because they contain classes
      // and functions with ambiguous identities.
      // Comparisons thus usually fail.
      // Instead we do a "good enough" comparison.
      expect(result._type).toEqual(expected._type);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });
});

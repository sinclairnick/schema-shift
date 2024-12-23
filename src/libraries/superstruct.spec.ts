import { describe, expect, test, vi } from "vitest";
import { CaseMap, TestCases } from "./common._spec";
import { createFromDef } from "../core/from-def";
import * as S from "superstruct";
import * as Subject from "./superstruct";

const schemas = {
  string: S.string(),
  boolean: S.boolean(),
  number: S.number(),
  objects: S.object({
    a: S.number(),
  }),
  date: S.date(),
  "nested objects": S.object({
    a: S.object({
      b: S.object({
        c: S.boolean(),
      }),
    }),
  }),
  arrays: S.array(S.string()),
  "nested arrays": S.array(S.array(S.string())),
  any: S.any(),
  enum: S.enums(["A", "B"]),

  // TODO: Superstruct doesn't seem to actually define
  // this information anywhere, declaratively.
  // optionals: S.optional(S.number()),
  // intersections: S.intersection([S.number(), S.boolean()]),
  // unions: S.union([S.number(), S.boolean()]),
  // tuples: S.tuple([S.number(), S.boolean()]),
} satisfies Partial<CaseMap>;

describe("Superstruct", () => {
  describe("Parser", () => {
    for (const [key, def] of TestCases) {
      const schema = schemas[
        key as keyof typeof schemas
      ] as Subject.AnySuperstructSchema;
      const title = `Works with ${key}`;

      if (!schema) {
        test.skip(title);
        continue;
      }

      test(title, () => {
        expect(Subject.superstructToDef(schema)).toEqual(def);
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
        const result = Subject.superstructFromDef(def);
        expect(result.type).toEqual(result.type);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
      });
    }
  });
});

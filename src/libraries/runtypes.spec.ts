import { describe, expect, test } from "vitest";
import { CaseMap, TestCases } from "./common._spec";
import { createToDef } from "../core/to-def";
import { createFromDef } from "../core/from-def";
import {
  String,
  Number,
  Boolean,
  Symbol,
  Undefined,
  Record,
  Array,
  Union,
  Intersect,
  Tuple,
  Optional,
} from "runtypes";
import superjson from "superjson";
import * as Subject from "./runtypes";

const schemas = {
  string: String,
  boolean: Boolean,
  number: Number,
  symbol: Symbol,
  undefined: Undefined,
  objects: Record({
    a: Number,
  }),
  "nested objects": Record({
    a: Record({ b: Record({ c: Boolean }) }),
  }),
  optionals: Optional(Number),
  // nullables: Union(Number, Null),
  arrays: Array(String),
  "nested arrays": Array(Array(String)),
  intersections: Intersect(Number, Boolean),
  unions: Union(Number, Boolean),
  tuples: Tuple(Number, Boolean),
} satisfies Partial<CaseMap>;

describe("Runtypes", () => {
  describe("Parser", () => {
    for (const [key, def] of TestCases) {
      const schema = schemas[key as keyof typeof schemas];
      const title = `Works with ${key}`;

      if (!schema) {
        test.skip(title);
        continue;
      }

      test(title, () => {
        expect(Subject.runtypesToDef(schema)).toEqual(def);
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
        const result = Subject.runtypesFromDef(def);

        expect(superjson.stringify(result)).toEqual(
          superjson.stringify(expected)
        );
      });
    }
  });
});

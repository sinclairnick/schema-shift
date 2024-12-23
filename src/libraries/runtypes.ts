import {
  String,
  Number,
  Boolean,
  Symbol,
  Null,
  Undefined,
  Record,
  Array,
  Union,
  Intersect,
  Tuple,
  Unknown,
  Optional,
  Nullish,
  Literal,
  Function,
} from "runtypes";
import { RuntypeBase } from "runtypes/lib/runtype";
import { createJsonSchemaFormatter } from "../core/to-json-schema";
import { createToDef } from "../core/to-def";
import { IsSchemaFn } from "../core/types";
import { SchemaDefOptions } from "../def-types/core";
import { createFromDef } from "../core/from-def";

type AnyRuntypesSchema =
  | RuntypeBase
  | String
  | Number
  | Boolean
  | Symbol
  | typeof Null
  | typeof Undefined
  | Function
  | ReturnType<typeof Literal>
  | ReturnType<typeof Record>
  | ReturnType<typeof Array>
  | ReturnType<typeof Union>
  | ReturnType<typeof Intersect>
  | ReturnType<typeof Tuple>
  | ReturnType<typeof Optional>
  | typeof Nullish
  | typeof Unknown;

export const runtypesToDef = createToDef<AnyRuntypesSchema>({
  identifyType(schema) {
    const opts: SchemaDefOptions = {};

    if (!("tag" in schema)) return { ...opts, type: "unknown" };

    switch (schema.tag) {
      // Wrapped
      case "array": {
        return { ...opts, type: "array", element: schema.element as any };
      }
      case "record": {
        return { ...opts, type: "object", properties: schema.fields as any };
      }
      case "intersect": {
        return {
          ...opts,
          type: "intersection",
          members: schema.intersectees as any,
        };
      }
      case "union": {
        return {
          ...opts,
          type: "union",
          members: schema.alternatives as any,
        };
      }
      case "tuple": {
        return { ...opts, type: "tuple", entries: schema.components as any };
      }
      case "function": {
        return { ...opts, type: "function" };
      }
      case "optional": {
        return {
          ...opts,
          optional: true,
          type: "unwrap",
          innerType: schema.underlying,
        };
      }

      // Primitive
      case "string": {
        return { ...opts, type: "string" };
      }
      case "number": {
        return { ...opts, type: "number" };
      }
      case "boolean": {
        return { ...opts, type: "boolean" };
      }
      case "literal": {
        const value = schema.value;

        if (value === null) {
          return { ...opts, type: "null" };
        }

        if (value === undefined) {
          return { ...opts, type: "undefined" };
        }
      }
      case "symbol": {
        return { ...opts, type: "symbol" };
      }
    }

    return { ...opts, type: "unknown" };
  },
});

export const runtypesFromDef = createFromDef<AnyRuntypesSchema>({
  format(def) {
    let s: AnyRuntypesSchema;

    switch (def.type) {
      case "string": {
        s = String;
        break;
      }
      case "number": {
        s = Number;
        break;
      }
      case "symbol": {
        s = Symbol;
        break;
      }
      case "boolean": {
        s = Boolean;
        break;
      }
      case "undefined": {
        s = Undefined;
        break;
      }
      case "null": {
        s = Null;
        break;
      }

      // Containers
      case "object": {
        s = Record(def.properties);
        break;
      }
      case "array": {
        s = Array(def.element);
        break;
      }
      case "tuple": {
        s = Tuple(...def.entries);
        break;
      }
      case "intersection": {
        const [first, ...rest] = def.members;
        s = Intersect(first, ...rest);
        break;
      }
      case "union": {
        const [first, ...rest] = def.members;
        s = Union(first, ...rest);
        break;
      }
      case "function": {
        s = Function;
        break;
      }
    }

    s ??= Unknown;

    if (def.nullable) {
      s = Union(s, Null);
    }

    if (def.optional) {
      s = Optional(s);
    }

    return s;
  },
});

// @ts-expect-error
export const isRuntypesSchema: IsSchemaFn<AnyRuntypesSchema> = (schema) => {
  return typeof schema === "object" && schema !== null && "reflect" in schema;
};

export const runtypesToJsonSchema = createJsonSchemaFormatter(runtypesToDef);

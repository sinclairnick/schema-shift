import {
  runtypesToJsonSchema,
  runtypesFromDef,
  runtypesToDef,
  isRuntypesSchema,
} from "./runtypes";

export * from "../libraries/runtypes";

export namespace RuntypesShift {
  export const toDef = runtypesToDef;
  export const fromDef = runtypesFromDef;
  export const toJsonSchema = runtypesToJsonSchema;
  export const isSchema = isRuntypesSchema;
}

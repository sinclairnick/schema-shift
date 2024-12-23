import {
  superstructToJsonSchema,
  superstructFromDef,
  superstructToDef,
  isSuperstructSchema,
} from "./superstruct";

export * from "../libraries/superstruct";

export namespace SuperstructShift {
  export const toDef = superstructToDef;
  export const fromDef = superstructFromDef;
  export const toJsonSchema = superstructToJsonSchema;
  export const isSchema = isSuperstructSchema;
}

import { joiToJsonSchema, joiFromDef, joiToDef, isJoiSchema } from "./joi";
export * from "../libraries/joi";

export namespace JoiShift {
  export const toDef = joiToDef;
  export const fromDef = joiFromDef;
  export const toJsonSchema = joiToJsonSchema;
  export const isSchema = isJoiSchema;
}

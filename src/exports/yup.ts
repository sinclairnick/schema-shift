import {
  yupToDef,
  yupFromDef,
  yupToJsonSchema,
  isYupSchema,
} from "../libraries/yup";
export * from "../libraries/yup";

export namespace YupShift {
  export const toDef = yupToDef;
  export const fromDef = yupFromDef;
  export const toJsonSchema = yupToJsonSchema;
  export const isSchema = isYupSchema;
}

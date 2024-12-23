import {
  typeBoxToDef,
  typeBoxFromDef,
  isTypeBoxSchema,
  typeBoxToJsonSchema,
} from "../libraries/typebox";
export * from "../libraries/typebox";

export namespace TypeBoxShift {
  export const toDef = typeBoxToDef;
  export const fromDef = typeBoxFromDef;
  export const toJsonSchema = typeBoxToJsonSchema;
  export const isSchema = isTypeBoxSchema;
}

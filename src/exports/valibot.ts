import {
  valibotToDef,
  valibotFromDef,
  valibotToJsonSchema,
  isValibotSchema,
} from "../libraries/valibot";
export * from "../libraries/valibot";

export namespace ValibotShift {
  export const toDef = valibotToDef;
  export const fromDef = valibotFromDef;
  export const toJsonSchema = valibotToJsonSchema;
  export const isSchema = isValibotSchema;
}

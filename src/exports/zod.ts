import {
  zodToDef,
  zodFromDef,
  zodToJsonSchema,
  isZodSchema,
} from "../libraries/zod";
export * from "../libraries/zod";

export namespace ZodShift {
  export const toDef = zodToDef;
  export const fromDef = zodFromDef;
  export const toJsonSchema = zodToJsonSchema;
  export const isSchema = isZodSchema;
}

import { oas31 } from "openapi3-ts";
import { ToDefFn } from "./types";
import { typeBoxFromDef } from "../libraries/typebox";

export const createJsonSchemaFormatter = <TSchemaAny>(
  toDef: ToDefFn<TSchemaAny>
) => {
  return (schema: TSchemaAny) => {
    return typeBoxFromDef(toDef(schema)) as oas31.SchemaObject;
  };
};

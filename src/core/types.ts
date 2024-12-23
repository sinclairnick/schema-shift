import * as T from "@sinclair/typebox";
import { Infer } from "../universal/types";
import { SchemaDef } from "../def-types/schema-def";

export type ToDefFn<TSchemaAny> = (schema: TSchemaAny) => SchemaDef;
export type FromDefFn<TSchemaAny> = <T extends TSchemaAny = TSchemaAny>(
  def: SchemaDef
) => T;
export type IsSchemaFn<TSchemaAny> = (value: unknown) => value is TSchemaAny;
export type ToJsonSchemaFn<TSchemaAny> = (schema: TSchemaAny) => T.TAnySchema;
export type ParseFn<TSchemaAny> = <T extends TSchemaAny>(
  schema: T,
  value: unknown
) => Infer<T>;

export type SchemaShift<TSchemaAny = unknown> = {
  toDef: ToDefFn<TSchemaAny>;
  fromDef: FromDefFn<TSchemaAny>;
  toJsonSchema: ToJsonSchemaFn<TSchemaAny>;
  isSchema: IsSchemaFn<TSchemaAny>;
  parse: ParseFn<TSchemaAny>;
};

export type MultiShift<TSchemaAny = unknown> = Pick<
  SchemaShift<TSchemaAny>,
  "toDef" | "isSchema" | "parse" | "toJsonSchema"
>;

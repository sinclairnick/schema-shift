import { DefRaw, UnwrapDefRaw } from "../def-types/raw-def";
import { SchemaDef } from "../def-types/schema-def";

/**
 * A definition specifying how to recreate a schema given a schema definition.
 */
export type CreateFromDefInput<TSchemaAny = unknown> = {
  format: (def: Exclude<DefRaw<TSchemaAny>, UnwrapDefRaw>) => TSchemaAny;
};

export const createFromDef = <TSchemaAny>(
  formatter: CreateFromDefInput<TSchemaAny>
) => {
  const format = (def: SchemaDef): TSchemaAny => {
    let schema: any;

    switch (def.type) {
      // Specifically handle container types
      case "object": {
        const properties: Record<PropertyKey, any> = {};

        for (const key in def.properties ?? {}) {
          properties[key] = format(def.properties[key]);
        }

        schema = formatter.format({ ...def, properties });

        break;
      }
      case "array": {
        const element: any = format(def.element);

        schema = formatter.format({ ...def, element });
        break;
      }
      case "tuple": {
        const entries: any[] = def.entries.map(format);

        schema = formatter.format({ ...def, entries });
        break;
      }
      case "union": {
        const members: any[] = def.members.map(format);

        schema = formatter.format({ ...def, members });
        break;
      }
      case "intersection": {
        const members: any[] = def.members.map(format);

        schema = formatter.format({ ...def, members });
        break;
      }
      case "function": {
        const parameters = def.parameters?.map(format);
        const result = def.result ? format(def.result) : undefined;

        schema = formatter.format({ ...def, parameters, result });
        break;
      }

      // Non-container types.
      default: {
        schema ??= formatter.format(def);
      }
    }

    return schema;
  };

  return format;
};

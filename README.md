# Schema Shift

Schema shift provides a unified API for interacting with schema libraries programmatically and converting between schema libraries and formats. Modify, introspect and convert schemas defined using most popular validation libraries.

```sh
npm i schema-shift
```

## Features

-   [x] Generate JSON Schema definitions
-   [x] Convert schema between various libraries
-   [x] Universal interface for parsing values and inferring types
-   [x] Traverse, introspect and transform schemas

## Example Usage

```ts
// Define a schema
const MyZodSchema = z.object({ foo: z.string() });

// Generate intermediate representation of the schema
const mySchemaDef = ZodShift.toDef(MyZodSchema);

// Convert that into a different schema library...
const MyJoiSchema = JoiShift.fromDef(mySchemaDef);

// ...or into JSON Schema
const jsonSchema = JoiShift.toJsonSchema(MyJoiSchema);
```

## Table of Contents

-   [Why?](#why)
-   [How?](#how)
-   [API Reference](#api-reference)
    -   [Core Functionality](#core-functionality)
    -   [Utilities](#utilities)
        -   [`Infer<T>`](#infer)
        -   [`parse`](#parsevalue)
        -   [`getParseFn`](#getparsefnschema)

## Why?

The JS ecosystem boasts countless schema validation libraries. While this offers the benefit of choice, it also leads to fragmentation of the ecosystem and makes it harder for libraries to integrate with one another.

Schema Shift unifies the ecosystem of validation libraries by making it trivial to manage, modify and transform schema between different forms. For library authors, this makes it easy to support many different validation/schema libraries without explicitly hand-rolling code for each.

## How?

Schema Shift transforms a given schema, defined using one of the many supported schema libraries, into an intermediate JSON Schema-like representation. In turn, this can be used to produce the equivalent schema in another library, modify the schema shape without touching any internals, or generate a JSON schema definition.

```
{Schema A} --[.toDef()]--> {Abstract Definition} --[.fromDef()]--> {Schema B}
```

## API Reference

Schema Shift currently supports the following libraries.

|             | import                                                        |
| ----------- | ------------------------------------------------------------- |
| Zod         | `import { ZodShift } from "schema-shift/zod"`                 |
| Yup         | `import { YupShift } from "schema-shift/yup"`                 |
| Joi         | `import { JoiShift } from "schema-shift/joi"`                 |
| Valibot     | `import { ValibotShift } from "schema-shift/valibot"`         |
| TypeBox     | `import { TypeBoxShift } from "schema-shift/typebox"`         |
| Superstruct | `import { SuperstructShift } from "schema-shift/superstruct"` |
| Runtypes    | `import { RuntypesShift } from "schema-shift/runtypes"`       |

### Core Functionality

Schema Shift exports library-specific namespaces which expose the functions listed below.

#### `<namespace>.toDef(schema)`

> Creates a definition (internal representation) for the given schema.

```ts
const def = ZodShift.toDef(MyZodSchema);
```

We can supply this `def`inition to one of the various formatter functions below. Modifying the `def` allows us to produces changes in any schema produced by the formatting functions which accept a `def` as input, listed below.

#### `<namespace>.fromDef(def)`

> Creates a schema from the given definition.

```ts
const MyZodSchema = ZodShift.fromDef(def);
```

By providing a `def` to a `.fromDef` function, we instantiate a schema corresponding to the namespace. In other words, `ZodShift.fromDef` creates a `zod` schema, and so forth.

Because `.fromDef` handles schema definitions programmatically, type information is _not_ preserved as if you were describing a schema explicitly. Therefore, this process is intended for runtime-specific use-cases, like validating values conform to a specific shape.

#### `<namespace>.toJsonSchema(schema)`

> Convert a schema to JSON Schema form.

```ts
const jsonSchema = ZodShift.toJsonSchema(MyZodSchema);
```

We can transform a schema into it's JSON Schema equivalent via `.toJsonSchema`, which can be used with OpenAPI specs, for example.

This function will require installing `@sinclair/typebox`.

_Under the hood, this function is really just sugar for creating a `def` and passing it to `TypeBoxShift.fromDef`, which provides a JSON Schema representation._

#### `<namespace>.isSchema(value)`

> Determine if an unknown value is a schema object.

```ts
const isZodSchema = ZodShift.isSchema(maybeZodSchema);
```

We might not always have control over or knowledge of certain values in our programs. We can verify whether an unknown value is in fact a schema or not using `.isSchema`.

_Note that `.isSchema` is only a heuristic, and determining schema type is not an exact science._

### Utilities

These utilities are not library-specific, and can be imported via the root package.

```ts
import { ... } from "schema-shift";
```

#### Infer<T>

The `Infer` type utility enables inferring the output type of any supported schema. Additionally, the `InferIn` utility can be used to infer the "input" type, meaning the expected type _before the schema performs any transformations_.

```ts
import { Infer, InferIn } from "schema-shift";

const User = z.object({
    id: z.number().transform(String),
});

type User = Infer<typeof User>;
// { id: string }

type UserIn = InferIn<typeof User>;
// { id: number }
```

#### parse(value)

The `parse` function enables parsing any supported schema by providing the schema and value.

```ts
import { parse, Parser } from "schema-shift";

const FooZod = z.object({ foo: z.boolean() });
const BarJoi = J.object({ bar: J.boolean() });

parse(FooZod, { foo: true });
// { foo: boolean }

parse(BarJoi, { bar: true });
// { bar: boolean }

// Use the `Parser` type for custom functionality
const customParser = (parser: Parser, value: unknown) => {
    return parse(parser, value);
};
```

#### getParseFn(schema)

Given an unknown schema, returns a function that can parse values.

```ts
import { getParseFn } from "schema-shift";

const FooZod = z.object({ foo: z.boolean() });

const parser = getParseFn(FooZod);

parser({ foo: true });
// { foo: boolean }
```

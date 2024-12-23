import { Infer, Parser } from "./universal/types";
import { getParseFn } from "./universal/parser";

export { type Infer, type Parser } from "./universal/types";

export const parse = <T extends Parser>(
  parser: T,
  value: unknown
): Infer<T> => {
  return getParseFn(parser)(value);
};

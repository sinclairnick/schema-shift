import { Infer, Parser } from "./universal/types";
import { getParseFn } from "./universal/parser";

export type { Infer, InferIn, Parser } from "./universal/types";
export { getParseFn } from "./universal/parser";

export const parse = <T extends Parser>(
    parser: T,
    value: unknown
): Infer<T> => {
    return getParseFn(parser)(value);
};

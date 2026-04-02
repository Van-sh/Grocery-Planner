import { days, EMealType } from "../constants";
import { Option } from "./autoComplete";

/**
 * Expands an intersection or mapped type into a flat, readable object type.
 *
 * TypeScript often displays complex types as intersections (`A & B & C`)
 * or opaque mapped types in IDE tooltips. Wrapping with `Prettify` forces
 * the compiler to resolve and display the final merged shape — making
 * hover tooltips and error messages far easier to read.
 *
 * @typeParam T - The type to expand. Works on object types, intersections,
 *   mapped types, and conditional type results. Primitives pass through unchanged.
 *
 * @example Flatten an intersection
 * ```ts
 * type A = { id: number };
 * type B = { name: string };
 * type Raw    = A & B;              // hover shows: A & B
 * type Pretty = Prettify<A & B>;   // hover shows: { id: number; name: string }
 * ```
 *
 * @example Reveal mapped-type results
 * ```ts
 * type Flags = Prettify<Record<'read' | 'write' | 'exec', boolean>>;
 * // { read: boolean; write: boolean; exec: boolean }
 * ```
 *
 * @example Debug a deep utility chain
 * ```ts
 * type Config = Prettify<
 *   Required<Partial<Omit<ServerOptions, 'internal'>>>
 * >;
 * // Hover now shows every resolved key instead of the nested utility stack.
 * ```
 *
 * @remarks
 * - This is a **zero-cost** compile-time helper. It emits no JavaScript.
 * - Only the *display* of the type changes — the structural type is identical.
 * - Does **not** deeply expand nested object properties; apply recursively for nested types.
 * - Primitives (`string`, `number`, `boolean`, etc.) are returned as-is
 *   because they have no keys to iterate.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/mapped-types.html Mapped Types}
 * @see {@link https://gist.github.com/palashmon/db68706d4f26d2dbf187e76409905399 Github Gist}
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type TUser = {
  id: string;
  name: string;
  fName: string;
  lName: string;
};

export type TDays = (typeof days)[number];

export type TMealDishBase = {
  dish: Option;
};

export type MealTypeKey = keyof typeof EMealType;

export type TMeal = {
  mealType: MealTypeKey;
  name: string;
  dishes: TMealDishBase[];
};

export type TCreatePlanBase = {
  name: string;
  isPrivate: boolean;
  isActive: boolean;
};

export type TPlansBase = TCreatePlanBase & {
  meals: { [K in TDays]?: TMeal[] };
};

export type TPlans = TPlansBase & {
  _id: string;
  createdAt: string;
  createdBy: TUser;
  updatedAt: string;
  updatedBy: TUser;
};

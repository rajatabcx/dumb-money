/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as company from "../company.js";
import type * as customer from "../customer.js";
import type * as file from "../file.js";
import type * as invoiceHelper from "../invoiceHelper.js";
import type * as invoices from "../invoices.js";
import type * as useHelper from "../useHelper.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  company: typeof company;
  customer: typeof customer;
  file: typeof file;
  invoiceHelper: typeof invoiceHelper;
  invoices: typeof invoices;
  useHelper: typeof useHelper;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

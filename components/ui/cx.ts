/**
 * Tiny class-name joiner. Filters out false, null, undefined and empty strings
 * so a conditional class can be written inline without a dependency.
 */
export type ClassValue = string | false | null | undefined;

export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(' ');
}

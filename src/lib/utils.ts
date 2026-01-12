export type QueryValue = string | number | boolean | null | undefined | Date;
export type QueryObject = Record<string, QueryValue>;

/**
 * Build URLSearchParams from a typed query object.
 * Use a concrete interface (e.g. GetActivityLogQuery) as the generic parameter
 * so the passed query must match that interface:
 *   buildQueryParams<GetActivityLogQuery>(query)
 */
export function buildQueryParams<T extends QueryObject = QueryObject>(
  query?: T
): URLSearchParams {
  const queryParams = new URLSearchParams();
  if (!query) return queryParams;

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value === "") return;
    if (typeof value === "boolean" && value === false) return;

    queryParams.append(key, String(value));
  });

  return queryParams;
}

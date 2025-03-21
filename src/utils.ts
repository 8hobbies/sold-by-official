/** @license GPL-3.0-or-later
 *
 * Copyright (C) 2024 8 Hobbies, LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/** Add a param to a URL. */
export function addUrlParam(
  url: string,
  paramKey: string,
  paramValue: string,
): string | null {
  const parsedUrl = URL.parse(url);

  // TODO: Impossible to create a case to trigger this part for now. Remove the coverage exception once we can.
  /* c8 ignore start */
  if (parsedUrl === null) {
    // Not a URL.
    console.error(`${url} is not a URL.`);
    return null;
  }
  /* c8 ignore stop */

  parsedUrl.searchParams.set(paramKey, paramValue);
  return parsedUrl.toString();
}

/** Add a param to a URL. if the key already exists, treat the value as
 * delimiter-separated and append the specified value.
 */
export function addUrlParamDelimiterSeparated(
  url: string,
  paramKey: string,
  paramValue: string,
  delimiter: string,
): string | null {
  const parsedUrl = URL.parse(url);

  // TODO: Impossible to create a case to trigger this part for now. Remove the coverage exception once we can.
  /* c8 ignore start */
  if (parsedUrl === null) {
    // Not a URL.
    console.error(`${url} is not a URL.`);
    return null;
  }
  /* c8 ignore stop */

  const existingValue = parsedUrl.searchParams.get(paramKey);
  if (existingValue === null) {
    return addUrlParam(url, paramKey, paramValue);
  }

  if (existingValue.split(delimiter).includes(paramValue)) {
    // No need to change since the param value is already in the value.
    return url;
  }
  return addUrlParam(
    url,
    paramKey,
    `${existingValue}${delimiter}${paramValue}`,
  );
}

/** Remove a param from a URL. */
export function removeUrlParam(url: string, paramKey: string): string | null {
  const parsedUrl = URL.parse(url);

  // TODO: Impossible to create a case to trigger this part for now. Remove the coverage exception once we can.
  /* c8 ignore start */
  if (parsedUrl === null) {
    // Not a URL.
    console.error(`${url} is not a URL.`);
    return null;
  }
  /* c8 ignore stop */

  parsedUrl.searchParams.delete(paramKey);
  return parsedUrl.toString();
}

/** Are the two URLs equal? */
export function areUrlsEqual(url1: string, url2: string): boolean {
  const urls = [new URL(url1), new URL(url2)];
  // Normalize the query strings.
  for (const url of urls) {
    url.search = new URLSearchParams(url.search).toString();
  }
  return urls[0].toString() === urls[1].toString();
}

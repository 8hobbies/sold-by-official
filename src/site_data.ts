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

import { addUrlParam, removeUrlParam } from "./utils";

export interface SiteDataEntry {
  id: string;
  // Human readable name.
  name: string;
  // Regular expression to match the website.
  urlRegex: RegExp;
  // Function being called when the user visits a website of interest.
  activatingFunc: (url: string) => string | null;
  // Function being called when the user clicks on the extension icon to disable.
  disablingFunc: (url: string) => string | null;
}

export type SiteData = SiteDataEntry[];

export const siteParams = {
  "Amazon.com": {
    key: "rh",
    value: "p_6:ATVPDKIKX0DER",
  },
  "Amazon.ca": {
    key: "rh",
    value: "p_6:A3DWYIK6Y9EEQB",
  },
} as const;

export const builtinSiteData = [
  {
    id: "Amazon.com",
    name: "Amazon.com",
    urlRegex: /https:\/\/www\.amazon\.com\/s.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.com"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.com"].key,
        siteParams["Amazon.com"].value,
      ),
  },
  {
    id: "Amazon.ca",
    name: "Amazon.ca",
    urlRegex: /https:\/\/www\.amazon\.ca\/s.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.ca"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.ca"].key,
        siteParams["Amazon.ca"].value,
      ),
  },
] as const satisfies SiteData;

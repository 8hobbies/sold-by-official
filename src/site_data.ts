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
  name: string;
  // Regular expression to match the website.
  urlRegex: RegExp;
  // Function being called when the user visits a website of interest.
  activatingFunc: (url: string) => string | null;
  // Function being called when the user clicks on the extension icon to disable.
  disablingFunc: (url: string) => string | null;
}

export type SiteData = SiteDataEntry[];

export const amazonComParam = {
  key: "rh",
  value: "n:16310101,p_6:ATVPDKIKX0DER",
};

export const builtinSiteData = [
  {
    name: "Amazon.com",
    urlRegex: /https:\/\/www\.amazon\.com\/s.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, amazonComParam.key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(url, amazonComParam.key, amazonComParam.value),
  },
] as const satisfies SiteData;

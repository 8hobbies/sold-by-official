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

import type { SiteData, SiteDataEntry } from "./site_data";

// TODO: Move this to a utility library.
function isIn<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}

function getMatchedSite(url: string, siteData: SiteData): SiteDataEntry | null {
  const matchedSite = siteData.find((siteDataEntry) =>
    siteDataEntry.urlRegex.exec(url),
  );

  return matchedSite ?? null;
}

/** Returns the updated URL of the functionality of this extension on a given current URL. */
export async function generateActivatingUrl(
  url: string,
  siteData: SiteData,
): Promise<string | null> {
  const matchedSite = getMatchedSite(url, siteData);

  if (matchedSite === null) {
    return null;
  }

  // Don't generate URL if not activated.
  const matchedSiteId = matchedSite.id;
  const onOffOptions: unknown = (
    await chrome.storage.local.get({ onOff: { [matchedSiteId]: true } })
  ).onOff;
  if (
    typeof onOffOptions !== "object" ||
    onOffOptions === null ||
    !isIn(matchedSiteId, onOffOptions)
  ) {
    throw new Error("Unexpected onOff options type");
  }

  const activated = Boolean(onOffOptions[matchedSiteId]);

  return activated ? matchedSite.activatingFunc(url) : null;
}

export function generateDisablingUrl(
  url: string,
  siteData: SiteData,
): string | null {
  const matchedSite = getMatchedSite(url, siteData);

  return matchedSite?.disablingFunc(url) ?? null;
}

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
import { getOnOffOption, toggleOnOffOption } from "./onoff_options";

function getMatchedSite(url: string, siteData: SiteData): SiteDataEntry | null {
  const matchedSite = siteData.find((siteDataEntry) =>
    siteDataEntry.urlRegex.exec(url),
  );

  return matchedSite ?? null;
}

async function generateActivatingUrlFromSiteDataEntry(
  url: string,
  site: SiteDataEntry | null,
): Promise<string | null> {
  if (site === null) {
    return null;
  }

  // Don't generate URL if not activated.
  return (await getOnOffOption(site.id)) ? site.activatingFunc(url) : null;
}

/** Returns the updated URL of the functionality of this extension on a given
    current URL. Called when visiting a web page. */
export async function generateActivatingUrl(
  url: string,
  siteData: SiteData,
): Promise<string | null> {
  const matchedSite = getMatchedSite(url, siteData);

  // Don't generate URL if not activated.
  return generateActivatingUrlFromSiteDataEntry(url, matchedSite);
}

function generateDisablingUrlFromSiteDataEntry(
  url: string,
  site: SiteDataEntry | null,
): string | null {
  return site?.disablingFunc(url) ?? null;
}

/** Returns the URL after the user disables the extension for the site being
    visited. */
export function generateDisablingUrl(
  url: string,
  siteData: SiteData,
): string | null {
  const matchedSite = getMatchedSite(url, siteData);

  return generateDisablingUrlFromSiteDataEntry(url, matchedSite);
}

export async function toggleExtensionOnCurrentSite(
  url: string,
  siteData: SiteData,
): Promise<string | null> {
  const matchedSite = getMatchedSite(url, siteData);

  if (matchedSite === null) {
    return null;
  }

  if (await toggleOnOffOption(matchedSite.id)) {
    return generateActivatingUrlFromSiteDataEntry(url, matchedSite);
  } else {
    return generateDisablingUrlFromSiteDataEntry(url, matchedSite);
  }
}

/** Get the new badge text for a given tab. */
export async function getUpdatedBadgeText(
  url: string,
  siteData: SiteData,
): Promise<string> {
  const matchedSite = getMatchedSite(url, siteData);
  return matchedSite === null
    ? ""
    : (await getOnOffOption(matchedSite.id))
      ? "ON"
      : "OFF";
}

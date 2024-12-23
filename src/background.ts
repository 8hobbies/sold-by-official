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

import {
  generateActivatingUrl,
  getUpdatedBadgeText,
  toggleExtensionOnCurrentSite,
} from "./main";
import { builtinSiteData } from "./site_data";

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await chrome.tabs.create({
      url: "https://www.goodaddon.com/sold-by-official/",
    });
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    await chrome.tabs.create({
      url: "https://www.goodaddon.com/sold-by-official/#changelog",
    });
  }
});

// Override URL when navigating.
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) {
    return; // We are not concerned with subframes.
  }

  const url = await generateActivatingUrl(details.url, builtinSiteData);
  if (url === null || url === details.url) {
    return;
  }
  await chrome.tabs.update(details.tabId, {
    url,
  });
});

// Update badge text once the browser commits to visit a page.
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) {
    return; // We are not concerned with subframes.
  }

  await chrome.action.setBadgeText({
    tabId: details.tabId,
    text: await getUpdatedBadgeText(details.url, builtinSiteData),
  });
});

// Toggle
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url === undefined || tab.url.length === 0 || tab.id === undefined) {
    // No permission
    return;
  }

  const url = await toggleExtensionOnCurrentSite(tab.url, builtinSiteData);
  if (url === null || url === tab.url) {
    return;
  }

  await chrome.tabs.update(tab.id, {
    url,
  });
});

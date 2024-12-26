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

/** Callback when navigating to a new URL and we may need to update the URL. */
async function updateToNewUrlCallback(
  details:
    | chrome.webNavigation.WebNavigationTransitionCallbackDetails
    | chrome.webNavigation.WebNavigationParentedCallbackDetails,
): Promise<void> {
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
}

// Override URL when history state is updated. Normal websites work fine with
// onBeforeNavigate. Some websites update history state through the history API
// and do not navigate to a new target, such as target.com and walmart.com, thus
// onBeforeNavigate isn't fired on those sites. Override URL when navigating.
chrome.webNavigation.onBeforeNavigate.addListener(updateToNewUrlCallback);
chrome.webNavigation.onHistoryStateUpdated.addListener(updateToNewUrlCallback);

/** Callback when determined to navigate to a new URL and we may need to update
 * badge text.
 */
async function updateBadgeTextCallback(
  details: chrome.webNavigation.WebNavigationTransitionCallbackDetails,
): Promise<void> {
  if (details.frameId !== 0) {
    return; // We are not concerned with subframes.
  }

  await chrome.action.setBadgeText({
    tabId: details.tabId,
    text: await getUpdatedBadgeText(details.url, builtinSiteData),
  });
}
// Update badge text once the browser commits to visit a page. Like
// updateToNewUrlCallback, some websites use history API and thus don't trigger
// onCommitted. Therefore, we need onHistoryStateUpdated as well.
//
// We listen to onCommitted instead of onBeforeNavigate because tab ID may
// change after onBeforeNavigate is fired and thus nullifies the badge text
// update.
chrome.webNavigation.onCommitted.addListener(updateBadgeTextCallback);
chrome.webNavigation.onHistoryStateUpdated.addListener(updateBadgeTextCallback);

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

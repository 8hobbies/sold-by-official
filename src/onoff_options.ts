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

import { isInObject } from "@8hobbies/utils";

/** Get the on/off status of a site. */
export async function getOnOffOption(siteId: string): Promise<boolean> {
  const onOffOptions: unknown = // If siteId is absent, it is treated as on.
    (await chrome.storage.local.get({ onOff: { [siteId]: true } })).onOff;
  if (
    typeof onOffOptions !== "object" ||
    onOffOptions === null ||
    !isInObject(siteId, onOffOptions)
  ) {
    throw new Error("Unexpected onOff options type");
  }

  return Boolean(onOffOptions[siteId]);
}

/** Toggle the on/off status of a site. Returns the new status. */
export async function toggleOnOffOption(siteId: string): Promise<boolean> {
  const onOffOptions: unknown = (await chrome.storage.local.get("onOff")).onOff;
  let widenedOnOffOptions: object;
  if (typeof onOffOptions !== "object" || onOffOptions === null) {
    widenedOnOffOptions = {
      [siteId]: true,
    };
  } else {
    widenedOnOffOptions = onOffOptions;
  }
  // If siteId is absent, it is treated as on.
  const newValue =
    isInObject(siteId, widenedOnOffOptions) && !widenedOnOffOptions[siteId];
  await chrome.storage.local.set({
    onOff: { ...widenedOnOffOptions, ...{ [siteId]: newValue } },
  });
  return newValue;
}

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

// TODO: Move this to a utility library.
function isIn<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}

/** Get the on/off status of a site. */
export async function getOnOffOption(siteId: string): Promise<boolean> {
  const onOffOptions: unknown = (
    await chrome.storage.local.get({ onOff: { [siteId]: true } })
  ).onOff;
  if (
    typeof onOffOptions !== "object" ||
    onOffOptions === null ||
    !isIn(siteId, onOffOptions)
  ) {
    throw new Error("Unexpected onOff options type");
  }

  // If siteId is absent, it is treated as on.
  return !isIn(siteId, onOffOptions) || Boolean(onOffOptions[siteId]);
}

/** Toggle the on/off status of a site. Returns the new status. */
export async function toggleOnOffOption(siteId: string): Promise<boolean> {
  const onOffOptions: unknown = (await chrome.storage.local.get("onOff")).onOff;
  if (typeof onOffOptions !== "object" || onOffOptions === null) {
    throw new Error("Unexpected onOff options type");
  }
  // If siteId is absent, it is treated as on.
  const newValue = isIn(siteId, onOffOptions) && !onOffOptions[siteId];
  await chrome.storage.local.set({
    onOff: { ...onOffOptions, ...{ [siteId]: newValue } },
  });
  return newValue;
}

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

import { SiteData, amazonComParam, builtinSiteData } from "./site_data";
import {
  generateActivatingUrl,
  generateDisablingUrl,
  toggleExtensionOnCurrentSite,
} from "./main";

describe("generate Url", () => {
  const activating1ResultUrl = "https://example.com/?result=activated" as const;
  const activating2ResultUrl = "https://example.org/?result=activated" as const;
  const siteData = [
    {
      id: "Test",
      name: "Test Example",
      urlRegex: /https:\/\/example\.com/,
      activatingFunc: (): string => activating1ResultUrl,
      disablingFunc: (): string => disabling1Result,
    },
    {
      id: "Test 2",
      name: "Test 2 Example",
      urlRegex: /https:\/\/example\.org/,
      activatingFunc: (): string => activating2ResultUrl,
      disablingFunc: (): string => disabling2Result,
    },
  ] as const satisfies SiteData;

  const activating1Result = {
    url: activating1ResultUrl,
    matchedSite: siteData[0],
  } as const;
  const disabling1Result = "https://example.com/?notactivated" as const;
  const matching1Url = "https://example.com";
  const matching2Url = "https://example.org";
  const activating2Result = {
    url: activating2ResultUrl,
    matchedSite: siteData[1],
  } as const;
  const disabling2Result = "https://example.org/?notactivated" as const;
  const unmatchingUrl = "https://example.net";

  beforeEach(async () => {
    vi.restoreAllMocks();
    resetBrowserStorage();
    await chrome.storage.local.set({
      onOff: { [siteData[0].id]: true, [siteData[1].id]: true },
    });
  });

  test("Returns activating function result if URL matches the first", async () => {
    expect(await generateActivatingUrl(matching1Url, siteData)).toStrictEqual(
      activating1Result,
    );
  });

  test("Returns activating function result if URL matches the second", async () => {
    expect(await generateActivatingUrl(matching2Url, siteData)).toStrictEqual(
      activating2Result,
    );
  });

  test("Returns disabling function result if URL matches the first", () => {
    expect(generateDisablingUrl(matching1Url, siteData)).toBe(disabling1Result);
  });

  test("Returns disabling function result if URL matches the second", () => {
    expect(generateDisablingUrl(matching2Url, siteData)).toBe(disabling2Result);
  });

  test("Returns activating function result if toggling when the site is enabled", async () => {
    await chrome.storage.local.set({
      onOff: { [siteData[0].id]: true },
    });
    expect(await toggleExtensionOnCurrentSite(matching1Url, siteData)).toBe(
      disabling1Result,
    );
  });

  test("Returns activating function result url if toggling when the site is disabled", async () => {
    await chrome.storage.local.set({
      onOff: { [siteData[0].id]: false },
    });
    expect(await toggleExtensionOnCurrentSite(matching1Url, siteData)).toBe(
      activating1Result.url,
    );
  });

  test("generateActivatingUrl returns null if no URL matches", async () => {
    expect(await generateActivatingUrl(unmatchingUrl, siteData)).toStrictEqual({
      url: null,
      matchedSite: null,
    });
  });

  for (const func of [
    generateDisablingUrl,
    toggleExtensionOnCurrentSite,
  ] as const) {
    test(`${func.name} returns null if no URL matches`, async () => {
      expect(await func(unmatchingUrl, siteData)).toBeNull();
    });
  }

  for (const falsyValue of [false, ""]) {
    test(`Activating function result is null url if option is false ${falsyValue.toString()}`, async () => {
      await chrome.storage.local.set({
        onOff: { [siteData[0].id]: falsyValue, [siteData[1].id]: falsyValue },
      });
      expect(await generateActivatingUrl(matching1Url, siteData)).toStrictEqual(
        {
          url: null,
          matchedSite: siteData[0],
        },
      );
      expect(await generateActivatingUrl(matching2Url, siteData)).toStrictEqual(
        {
          url: null,
          matchedSite: siteData[1],
        },
      );
    });
  }

  for (const option of [
    ["non-object onOff", { onOff: "not an object" }],
    ["null onOff", { onOff: null }],
  ] as const) {
    test(`Activating function throws if onOff is invalid: ${option[0]}`, async () => {
      const localOption: object = option[1];
      await chrome.storage.local.set(localOption);
      await expect(
        generateActivatingUrl(matching1Url, siteData),
      ).rejects.toThrow("Unexpected onOff options type");
    });

    test(`Toggle function treats as true if onOff is invalid: ${option[0]}`, async () => {
      const localOption: object = option[1];
      await chrome.storage.local.set(localOption);
      expect(await toggleExtensionOnCurrentSite(matching1Url, siteData)).toBe(
        disabling1Result,
      );
    });
  }
});

describe("builtin sitedata", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    resetBrowserStorage();
    await chrome.storage.local.set({
      onOff: { [builtinSiteData[0].id]: true },
    });
  });

  test("Amazon.com activating matched", async () => {
    expect(
      await generateActivatingUrl("https://www.amazon.com/s?", builtinSiteData),
    ).toStrictEqual({
      url: `https://www.amazon.com/s?${amazonComParam.key}=${encodeURIComponent(amazonComParam.value)}`,
      matchedSite: builtinSiteData[0],
    });
  });

  test("Amazon.com disabling matched", () => {
    expect(
      generateDisablingUrl("https://www.amazon.com/s?rh=", builtinSiteData),
    ).toBe("https://www.amazon.com/s");
  });
});

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

import { SiteData, builtinSiteData, siteParams } from "./site_data";
import {
  generateActivatingUrl,
  generateDisablingUrl,
  getUpdatedBadgeText,
  toggleExtensionOnCurrentSite,
} from "./main";

describe("generate Url", () => {
  const activating1Result = "https://example.com/?result=activated" as const;
  const disabling1Result = "https://example.com/?notactivated" as const;
  const matching1Url = "https://example.com";
  const matching2Url = "https://example.org";
  const activating2Result = "https://example.org/?result=activated" as const;
  const disabling2Result = "https://example.org/?notactivated" as const;
  const unmatchingUrl = "https://example.net";
  const siteData = [
    {
      id: "Test",
      name: "Test Example",
      urlRegex: /https:\/\/example\.com/,
      activatingFunc: (): string => activating1Result,
      disablingFunc: (): string => disabling1Result,
    },
    {
      id: "Test 2",
      name: "Test 2 Example",
      urlRegex: /https:\/\/example\.org/,
      activatingFunc: (): string => activating2Result,
      disablingFunc: (): string => disabling2Result,
    },
  ] as const satisfies SiteData;

  beforeEach(async () => {
    vi.restoreAllMocks();
    resetBrowserStorage();
    await chrome.storage.local.set({
      onOff: { [siteData[0].id]: true, [siteData[1].id]: true },
    });
  });

  test("Returns activating function result if URL matches the first", async () => {
    expect(await generateActivatingUrl(matching1Url, siteData)).toBe(
      activating1Result,
    );
  });

  test("Returns activating function result if URL matches the second", async () => {
    expect(await generateActivatingUrl(matching2Url, siteData)).toBe(
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

  test("Returns activating function result if toggling when the site is disabled", async () => {
    await chrome.storage.local.set({
      onOff: { [siteData[0].id]: false },
    });
    expect(await toggleExtensionOnCurrentSite(matching1Url, siteData)).toBe(
      activating1Result,
    );
  });

  for (const func of [
    generateActivatingUrl,
    generateDisablingUrl,
    toggleExtensionOnCurrentSite,
  ] as const) {
    test("Returns null if no URL matches", async () => {
      expect(await func(unmatchingUrl, siteData)).toBeNull();
    });
  }

  for (const falsyValue of [false, ""]) {
    test(`Activating function result is null if option is false ${falsyValue.toString()}`, async () => {
      await chrome.storage.local.set({
        onOff: { [siteData[0].id]: falsyValue, [siteData[1].id]: falsyValue },
      });
      expect(await generateActivatingUrl(matching1Url, siteData)).toBeNull();
      expect(await generateActivatingUrl(matching2Url, siteData)).toBeNull();
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

  describe("Badge text", () => {
    test("Badge text should be on if the extension is on on the site", async () => {
      await chrome.storage.local.set({
        onOff: { [siteData[0].id]: true },
      });
      expect(await getUpdatedBadgeText(matching1Url, siteData)).toBe("ON");
    });
    test("Badge text should be off if the extension is off on the site", async () => {
      await chrome.storage.local.set({
        onOff: { [siteData[0].id]: false },
      });
      expect(await getUpdatedBadgeText(matching1Url, siteData)).toBe("OFF");
    });
    test("Badge text should be empty if the site doesn't match", async () => {
      expect(await getUpdatedBadgeText(unmatchingUrl, siteData)).toBe("");
    });
  });
});

describe("builtin sitedata", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    resetBrowserStorage();
    await chrome.storage.local.set({
      // Let the extension be on on all sites. We need to explicitly set these
      // because the mock storage doesn't have the capability to set default
      // value like the real one.
      onOff: Object.fromEntries(builtinSiteData.map((site) => [site.id, true])),
    });
  });

  for (const amazonSiteId of ["Amazon.com", "Amazon.ca"] as const) {
    const tld = amazonSiteId.split(".").pop();

    test(`${amazonSiteId} activating matched`, async () => {
      expect(
        await generateActivatingUrl(
          `https://www.amazon.${tld}/s?`,
          builtinSiteData,
        ),
      ).toBe(
        `https://www.amazon.${tld}/s?${siteParams[amazonSiteId].key}=${encodeURIComponent(siteParams[amazonSiteId].value)}`,
      );
    });

    test(`${amazonSiteId} disabling matched`, () => {
      expect(
        generateDisablingUrl(
          `https://www.amazon.${tld}/s?rh=`,
          builtinSiteData,
        ),
      ).toBe(`https://www.amazon.${tld}/s`);
    });
  }
});

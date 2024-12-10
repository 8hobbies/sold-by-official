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
import { generateActivatingUrl, generateDisablingUrl } from "./main";

describe("generate Url", () => {
  const activatingResult = "https://example.com/?result=activated" as const;
  const disablingResult = "https://example.com/?notactivated" as const;
  const matchingUrl = "https://example.com";
  const unmatchingUrl = "https://example.org";
  const siteData = [
    {
      name: "Test Example",
      urlRegex: /https:\/\/example\.com/,
      activatingFunc: (): string => activatingResult,
      disablingFunc: (): string => disablingResult,
    },
  ] as const satisfies SiteData;

  test("Returns activating function result if URL matches", () => {
    expect(generateActivatingUrl(matchingUrl, siteData)).toBe(activatingResult);
  });

  test("Returns disabling function result if URL matches", () => {
    expect(generateDisablingUrl(matchingUrl, siteData)).toBe(disablingResult);
  });

  for (const func of [generateActivatingUrl, generateDisablingUrl] as const) {
    test("Returns null if no URL matches", () => {
      expect(func(unmatchingUrl, siteData)).toBeNull();
    });
  }

  describe("builtin sitedata", () => {
    test("Amazon.com activating matched", () => {
      expect(
        generateActivatingUrl("https://www.amazon.com/s?", builtinSiteData),
      ).toBe(
        `https://www.amazon.com/s?${amazonComParam.key}=${encodeURIComponent(amazonComParam.value)}`,
      );
    });

    test("Amazon.com disabling matched", () => {
      expect(
        generateDisablingUrl("https://www.amazon.com/s?rh=", builtinSiteData),
      ).toBe("https://www.amazon.com/s");
    });
  });
});

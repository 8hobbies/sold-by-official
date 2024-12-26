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
  id: string;
  // Human readable name.
  name: string;
  // Regular expression to match the website.
  urlRegex: RegExp;
  // Function being called when the user visits a website of interest.
  activatingFunc: (url: string) => string | null;
  // Function being called when the user clicks on the extension icon to disable.
  disablingFunc: (url: string) => string | null;
}

export type SiteData = SiteDataEntry[];

export const siteParams = {
  "Amazon.ca": {
    key: "rh",
    value: "p_6:A3DWYIK6Y9EEQB",
  },
  "Amazon.com": {
    key: "rh",
    value: "p_6:ATVPDKIKX0DER",
  },
  "Amazon.co.jp": {
    key: "rh",
    value: "p_6:AN1VRQENFRJN5",
  },
  "Amazon.co.uk": {
    key: "rh",
    value: "p_6:A3P5ROKL5A1OLE",
  },
  "Amazon.de": {
    key: "rh",
    value: "p_6:A3JWKAKR8XB7XF",
  },
  "Amazon.es": {
    key: "rh",
    value: "p_6:A1AT7YVPFBWXBL",
  },
  "Amazon.fr": {
    key: "rh",
    value: "p_6:A1X6FK5RDHNB96",
  },
  "Amazon.it": {
    key: "rh",
    value: "p_6:A11IL2PNWYJU7H",
  },
  "Newegg.ca": {
    key: "N",
    value: "8000",
  },
  "Newegg.com": {
    key: "N",
    value: "8000",
  },
  "Newegg.com-Global": {
    key: "N",
    value: "8000",
  },
  "Target.com": {
    key: "facetedValue",
    value: "dq4mn",
  },
  "Walmart.ca": {
    key: "facet",
    value: "retailer_type:Walmart",
  },
  "Walmart.com": {
    key: "facet",
    value: "retailer_type:Walmart",
  },
} as const;

export const builtinSiteData = [
  {
    id: "Amazon.ca",
    name: "Amazon.ca",
    urlRegex: /https:\/\/www\.amazon\.ca\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.ca"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.ca"].key,
        siteParams["Amazon.ca"].value,
      ),
  },
  {
    id: "Amazon.com",
    name: "Amazon.com",
    urlRegex: /https:\/\/www\.amazon\.com\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.com"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.com"].key,
        siteParams["Amazon.com"].value,
      ),
  },
  {
    id: "Amazon.co.jp",
    name: "Amazon.co.jp",
    urlRegex: /https:\/\/www\.amazon\.co\.jp\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.co.jp"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.co.jp"].key,
        siteParams["Amazon.co.jp"].value,
      ),
  },
  {
    id: "Amazon.co.uk",
    name: "Amazon.co.uk",
    urlRegex: /https:\/\/www\.amazon\.co\.uk\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.co.uk"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.co.uk"].key,
        siteParams["Amazon.co.uk"].value,
      ),
  },
  {
    id: "Amazon.de",
    name: "Amazon.de",
    urlRegex: /https:\/\/www\.amazon\.de\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.de"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.de"].key,
        siteParams["Amazon.de"].value,
      ),
  },
  {
    id: "Amazon.es",
    name: "Amazon.es",
    urlRegex: /https:\/\/www\.amazon\.es\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.es"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.es"].key,
        siteParams["Amazon.es"].value,
      ),
  },
  {
    id: "Amazon.fr",
    name: "Amazon.fr",
    urlRegex: /https:\/\/www\.amazon\.fr\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.fr"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.fr"].key,
        siteParams["Amazon.fr"].value,
      ),
  },
  {
    id: "Amazon.it",
    name: "Amazon.it",
    urlRegex: /https:\/\/www\.amazon\.it\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Amazon.it"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Amazon.it"].key,
        siteParams["Amazon.it"].value,
      ),
  },
  {
    id: "Newegg.ca",
    name: "Newegg.ca",
    urlRegex: /https:\/\/www\.newegg\.ca\/p\/pl\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Newegg.ca"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Newegg.ca"].key,
        siteParams["Newegg.ca"].value,
      ),
  },
  {
    id: "Newegg.com",
    name: "Newegg.com",
    urlRegex: /https:\/\/www\.newegg\.com\/p\/pl\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Newegg.com"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Newegg.com"].key,
        siteParams["Newegg.com"].value,
      ),
  },
  {
    id: "Newegg.com-Global",
    name: "Newegg.com-Global",
    urlRegex: /https:\/\/www\.newegg\.com\/global\/.+\/p\/pl\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Newegg.com-Global"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Newegg.com-Global"].key,
        siteParams["Newegg.com-Global"].value,
      ),
  },
  {
    id: "Target.com",
    name: "Target.com",
    urlRegex: /https:\/\/www\.target\.com\/s\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Target.com"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Target.com"].key,
        siteParams["Target.com"].value,
      ),
  },
  {
    id: "Walmart.ca",
    name: "Walmart.ca",
    urlRegex: /https:\/\/www\.walmart\.ca\/search\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Walmart.ca"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Walmart.ca"].key,
        siteParams["Walmart.ca"].value,
      ),
  },
  {
    id: "Walmart.com",
    name: "Walmart.com",
    urlRegex: /https:\/\/www\.walmart\.com\/search\?.*/,
    disablingFunc: (url: string): string | null =>
      removeUrlParam(url, siteParams["Walmart.com"].key),
    activatingFunc: (url: string): string | null =>
      addUrlParam(
        url,
        siteParams["Walmart.com"].key,
        siteParams["Walmart.com"].value,
      ),
  },
] as const satisfies SiteData;

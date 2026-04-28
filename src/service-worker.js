/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();
self.addEventListener('install', () => self.skipWaiting());

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(import.meta.env.BASE_URL + 'index.html')
);

// Serve cached rates immediately; only fetch when cache is missing or expired (6h)
registerRoute(
  ({ url }) => url.origin === 'https://open.er-api.com',
  new CacheFirst({
    cacheName: 'exchange-rates',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 6 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

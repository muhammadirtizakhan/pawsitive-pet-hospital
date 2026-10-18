'use client';

import { useEffect } from 'react';

// Loads the site's behaviour script (public/js/script.js) once, AFTER React has finished
// hydrating the page, so the script always sees the final markup.
// The script is the original, unchanged site logic (cart, wishlist, login, checkout, chatbot...).
export default function LegacyScript() {
  useEffect(() => {
    if (window.__pawsitiveScriptLoaded) return; // guards against React strict-mode double effects
    window.__pawsitiveScriptLoaded = true;
    const el = document.createElement('script');
    el.src = '/js/script.js';
    el.async = false;
    document.body.appendChild(el);
  }, []);
  return null;
}

// ==UserScript==
// @name         Airbnb trash listings hider
// @namespace    https://raw.githubusercontent.com/Mayurifag/airbnb-trash-listings-hide-userscript/main/userscript.js
// @version      2023.10.31
// @description  Hide listings with low rating and low number of reviews on Airbnb search page.
// @author       Mayurifag
// @match        https://www.airbnb.com/s/*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  const observer = new MutationObserver((mutationsList) => {
    const ratingPattern = /([\d.]+) \((\d+)\)/;
    const ratingThreshold = 4.75;
    const reviewCountThreshold = 5;

    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const itemListElements = addedNodes.filter(node =>
          node.tagName === 'DIV' && node.getAttribute('itemprop') === 'itemListElement'
        );

        if (itemListElements.length > 0) {
          const listing = itemListElements[0];
          const lines = listing.innerText.split('\n');
          const listingShortDescription = `${lines[0]} ${lines[1]}`;
          const lastLine = lines[lines.length - 1];
          const match = lastLine.match(ratingPattern);

          if (match) {
            let rating = parseFloat(match[1]);
            let reviewCount = parseInt(match[2], 10);

            // console.log(`${listingShortDescription} Rating: ${rating}, Review Count: ${reviewCount}`);

            if (rating < ratingThreshold) {
              console.log(`${listingShortDescription} has low rating`);
              listing.style.opacity = 0.1;
              return;
            }

            if (reviewCount < reviewCountThreshold) {
              console.log(`${listingShortDescription} has low review count`);
              listing.style.opacity = 0.2;
              return;
            }
          } else {
            console.log(`${listingShortDescription} has no rating and reviews`);
            listing.style.opacity = 0.1;
          }
        }
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });
})();

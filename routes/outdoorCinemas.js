const express = require("express");
const router = express.Router();
const { chromium } = require("playwright");

router.get("/", async (req, res) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://adventurecinema.co.uk/venues/");

  const loadMoreButton = page.locator(".psFilteredListings__paginationButton");

  while ((await loadMoreButton.count()) > 0) {
    const venueCountBefore = await page.locator(".blockLinks__card").count();

    await loadMoreButton.click();
    await page.waitForTimeout(2000);

    const venueCountAfter = await page.locator(".blockLinks__card").count();

    if (venueCountAfter === venueCountBefore) {
      break;
    }
  }

  const venueCards = page.locator(".blockLinks__card");
  const venueCount = await venueCards.count();

  const allVenues = [];

  for (let venueIndex = 0; venueIndex < venueCount; venueIndex++) {
    const currentVenue = venueCards.nth(venueIndex);

    const venueTitle = await currentVenue
      .locator(".blockLinks__title")
      .innerText();

    const venueLink = await currentVenue
      .locator("a")
      .first()
      .getAttribute("href");

    const venueShowing = await currentVenue
      .locator(".psFont--bold")
      .allInnerTexts();

    const showingDate = await currentVenue
      .locator(".eventDate--full")
      .allInnerTexts();

    const showings = [];

    for (let i = 0; i < venueShowing.length; i++) {
      showings.push({
        title: venueShowing[i],
        date: showingDate[i],
      });
    }

    allVenues.push({
      venueTitle,
      venueLink,
      showings,
    });
  }

  await browser.close();

  res.json({
    venues: allVenues,
  });
});

module.exports = router;

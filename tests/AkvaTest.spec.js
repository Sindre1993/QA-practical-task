const { test, expect } = require("@playwright/test");

// This is a fictional test that will fail, all the test steps written in this testcase
// has been written blindly without any sort of way of confirming if it would work or not,
// and is just a way of displaying my level of knowledge in automated testing.

// Default timeout set in playwright.config.js @ 5000ms

test("AkvaGroup Practical Task | Test Step 1", async ({ page }) => {
  // Test step #1

  // Enter Manage -> Cameras, and connects all cameras, verifies each step
  // with assertions along the way.

  // Go to website and verify title
  await page.goto("https://www.akvagroup.no/");
  await expect(page).toHaveTitle("AKVA group - Hjem");

  // Locates Manage button by ID, clicks, and verify title
  await page.locator(`#ManageBtn`).click();
  await expect(page).toHaveTitle("AKVA group - Manage");

  // Locates Camera button by ID, clicks, and verify title
  await page.locator(`#CameraBtn`).click();
  await expect(page).toHaveTitle("AKVA group - Cameras");

  // Locates radio button with input=Connect, verifies that the radio button is not checked
  expect(await page.locator("input[value='CONNECT']").isChecked()).toBeFalsy();
  await expect(page.locator("[style*=`block-status`]")).toContainText(
    "Detected"
  );

  // Locates radio button with input=Connect, verifies that the radio button is checked
  await page.locator("input[value='CONNECT']").check();
  expect(await page.locator("input[value='CONNECT']").isChecked()).toBeTruthy();

  // Expects status-block to contain the word "OK"
  await expect(page.locator("[style*=`status-block`]")).toContainText("OK");
});

test("AkvaGroup Practical Task | Test Step 2", async ({ page }) => {
  // Test step #2

  // In App Creator add one camera for each connected camera and links to the connected camera
  // Expected result should be "Cameras are added"

  // Go to website and verify title
  await page.goto("https://www.akvagroup.no/");
  await expect(page).toHaveTitle("AKVA group - Hjem");

  // Locates App Creator button using ID, clicks, verifies title.
  await page.locator(`#AppCreator`).click();
  await expect(page).toHaveTitle("AKVA group - App creator");

  // Gets the number of connected cameras
  const cameraList = (
    await page.locator(".camera-list .camera-connected")
  ).count();

  // Clicks on "Add Camera" for each connected camera

  // Loops through the camera list and clicks add camera button for each connected camera
  // Expects a verifying modal to appear.
  // Due to the wording in the assignment text there will be no checking if previous cameras
  // are already connected.
  for (let i = 0; i < cameraList; i++) {
    const addCamera = await page.locator("#addBtn");
    await addCamera.click();
    await page.waitForSelector(".modal");

    // Expects a modal dialog box to appear and links to the connected camera.
    const connect = await page.locator(".modal-confirm");
    await connect.click();
    await page.waitForSelector(".camera-list");

    // Confirms the link process
    const confirmBtn = await page.locator(".modal .camera-list .btn-ok");
    await confirmBtn.click();
    await expect(page.locator(".modal .alert")).toContainText("OK");

    // Closes the modal dialog box and awaits modal state to be hidden.
    const closeBtn = await page.locator(".modal .btn-close");
    await closeBtn.click();
    await page.waitForSelector(".modal", { state: `hidden` });
  }

  // Expects a confirmation that states that cameras has been added.
  const confirmAdded = await page.locator(".alert").textContent();
  expect(confirmAdded.trim().toBe("Cameras has been added"));
});

test("AkvaGroup Practical Task | Test Step 3", async ({ page }) => {
  // Test step #3

  // Go to website and verifies title.
  await page.goto("https://www.akvagroup.no/cameras");
  await expect(page).toHaveTitle("AKVA group - Cameras");

  // Locates Camera Views button by using ID, clicks and verifies title
  await page.locator(`#CameraViews`).click();
  await expect(page).toHaveTitle("AKVA group - Camera Views");

  // Locates New Camera View button by ID, clicks and waits for modal view to appear
  await page.locator(`#newCameraView`).click();
  await page.waitForSelector(".modal-view");

  // On the now appeared modal, control the new camera for a different view
  const panLeft = await page.locator("#pan-left");
  await panLeft.click();

  // Waits for camera to pan left to its desired location
  await page.waitForTimeout(1000);

  // Control the new camera for a different view
  const tiltUp = await page.locator("#tilt-up");
  await tiltUp.click();

  // Waits for camera to tilt up to its desired location
  await page.waitForTimeout(1000);

  // It appears that this is where Test step #3 for me stops, as I lack information and knowledge about
  // how the camera system is built, I fail to realize how I can expect a true/false statement
  // based on what a camera sees, but there might be a value that can be checked perhaps by using
  // sensors on every camera.

  // I recommend this test to be executed with manual testing, as automated tests are computationally
  // superior but humans are better at visually verifying objects in varying context.
});

test("AkvaGroup Practical Task | Test Step 4", async ({ page }) => {
  // Test step #4

  // Go to new page and verifies title
  await page.goto("https://www.akvagroup.no/camera/views");
  await expect(page).toHaveTitle("AKVA group - Camera views");

  // Double clicks on stream-one to make it fullscreen
  const stream = await page.locator(".stream-one");
  stream.dblclick();

  // Awaits for fullscreen mode to activate class
  await page.waitForSelector(".stream-one.fullscreen");

  // Confirms that the stream is in fullscreen mode
  const fullscreenOn = await page
    .locator(".stream-one.fullscreen")
    .evaluate((el) => {
      const { width, height } = el.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      return width === screenWidth && height === screenHeight;
    });

  expect(fullscreenOn).toBe(true);

  // Double clicks on fullscreen to go back to its original layout
  await stream.dblclick();

  // Waits for the stream to go back to its original layout, without class
  await page.waitForSelector(".stream-one:not(.fullscreen)");

  // Expects fullscreenOn to be false, verifying that the stream is no longer in fullscreen mode
  expect(fullscreenOn).toBe(false);
});

test("AkvaGroup Practical Task | Test Step 5", async ({ page }) => {
  // Test step #5

  // Loads all camera views and stresstests the application, verifying that streams are still visible
  // and responsive

  // Go to page and verify title
  await page.goto("https://www.akvagroup.no/camera/views");
  await expect(page).toHaveTitle("AKVA group - Camera views");

  // Waits for all streams to be visible
  await page.waitForSelector(`.stream`, { state: "visible", timeout: 30000 });

  // Clicks on all streams on the site
  const streams = await page.locator(`.stream`).elements();
  for (const stream of streams) {
    // Opens all streams by clicking the middle button to open a new tab
    await stream.click({ button: "middle" });
  }

  // Checks if all the camera views are still visable and responsive
  for (const stream of streams) {
    const isVisible = await stream.isVisible();
    expect(isVisible).toBe(true);

    const isResponsive = await stream.isIntersectingViewport();
    expect(isResponsive).toBe(true);
  }

  await page.close();

  // All tests have been run, closing test session.
});

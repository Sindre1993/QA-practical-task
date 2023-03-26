const { test, expect } = require("@playwright/test");

test("AkvaGroup Practical Task", async ({ page }) => {
  // This is a fictional test that will fail, I have only made this for personal test purposes

  // Test step #1

  // Enter Manage -> Cameras, and connects all cameras, verifies each step
  // with assertions along the way.

  await page.goto("https://www.akvagroup.no/");
  await expect(page).toHaveTitle("AKVA group - Hjem");

  await page.locator(`#ManageBtn`).click();
  await expect(page).toHaveTitle("AKVA group - Manage");

  await page.locator(`#CameraBtn`).click();
  await expect(page).toHaveTitle("AKVA group - Cameras");

  await page.locator("input[value='CONNECT']").check();
  expect(await page.locator("input[value='CONNECT']").isChecked()).toBeTruthy();

  await expect(page.locator("[style*=`block`]")).toContainText("OK");

  // Test step #2

  // In App Creator add one camera for each connected camera and links to the connected camera
  // Expected result should be "Cameras are added"

  await page.locator(`#AppCreator`).click();
  await expect(page).toHaveTitle("AKVA group - App creator");

  // Gets the number of connected cameras
  const cameraList = (
    await page.locator(".camera-list .camera-connected")
  ).count();

  // Clicks on "Add Camera" for each connected camera
  for (let i = 0; i < cameraList; i++) {
    const addCamera = await page.locator("#addBtn");
    await addCamera.click();
    await page.waitForSelector(".modal");

    // Expects a modal dialog box to appear and links to the connected camera
    const connect = await page.locator(".modal-confirm");
    await connect.click();
    await page.waitForSelector(".camera-list");

    // Confirms the link process
    const confirmBtn = await page.locator(".modal .camera-list .btn-ok");
    await confirmBtn.click();
    await expect(page.locator(".modal .alert")).toContainText("OK");

    // Closes the modal dialog box and awaits modal state to be hidden
    const closeBtn = await page.locator(".modal .btn-close");
    await closeBtn.click();
    await page.waitForSelector(".modal", { state: `hidden` });
  }

  // Expects a confirmation that states that cameras has been added
  const confirmAdded = await page.locator(".alert").textContent();
  expect(confirmAdded.trim().toBe("Cameras has been added"));

  // Test step #3

  await page.goto("https://www.akvagroup.no/cameras");
  await expect(page).toHaveTitle("AKVA group - Cameras");

  await page.locator(`#CameraViews`).click();
  await expect(page).toHaveTitle("AKVA group - Camera Views");

  await page.locator(`#newCameraView`).click();
  await page.waitForSelector(".modal-view");

  // Control the new camera for a different view
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

  // Test step #4

  await page.goto("https://www.akvagroup.no/camera/views");
  await expect(page).toHaveTitle("AKVA group - Camera views");

  // Double clicks on stream-one to make it fullscreen
  const stream = await page.locator(".stream-one");
  stream.dblclick();

  // Awaits for fullscreen mode to activate
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

  // Waits for the stream to go back to its original layout
  await page.waitForSelector(".stream-one:not(.fullscreen)");

  // Expects fullscreenOn to be false, verifying that the stream is no longer in fullscreen mode
  expect(fullscreenOn).toBe(false);

  // Test step #5

  // Loads all camera views and stresstests the application, verifying that streams are still visible
  // and responsive

  await page.goto("https://www.akvagroup.no/camera/views");
  await expect(page).toHaveTitle("AKVA group - Camera views");

  await page.waitForSelector(`.stream`, { state: "visible", timeout: 30000 });

  // Clicks on all views on the site
  const streams = await page.locator(`.stream`).elements();
  for (const stream of streams) {
    await stream.click();
  }

  // Checks if all the camera views are still visable and responsive

  for (const stream of streams) {
    const isVisable = await stream.isVisable();
    expect(isVisable).toBe(true);

    const isResponsive = await stream.isIntersectingViewport();
    expect(isResponsive).toBe(true);
  }
});

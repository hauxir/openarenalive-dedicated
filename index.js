const process = require("process");
const puppeteer = require("puppeteer");
const args = require("minimist")(process.argv.slice(2));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--no-sandbox",
    ],
  });
  const page = await browser.newPage();

  await page.goto("https://app.kosmi.io");
  const token = args.token;
  await page.evaluate((token) => {
    window.onbeforeunload = null;
    localStorage.setItem("token", token);
  }, token);
  const room_id = args.room_id;
  await page.goto("https://app.kosmi.io/room/" + room_id);
  page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].filter(
      (b) => b.innerText === "Click here to launch"
    )[0];
    if (btn) btn.click();
  });
  await page.evaluate(() => {
    window.isHeadless = true;
  });
  page.on("console", (msg) => console.log(msg._text));

  await page.waitForFunction(() => {
    return [...document.querySelectorAll("button")].some(
      (button) => button.textContent.trim() === "Start Server"
    );
  });

  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (button) => button.textContent.trim() === "Start Server"
    );
    if (button) button.click();
  });
})();

const puppeteer = require("puppeteer");
const argv = require("minimist")(process.argv.slice(2));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
    ],
  });
  const page = await browser.newPage();

  await page.goto("https://app.kosmi.io");
  await page.evaluate(() => {
    localStorage.setItem("token", argv.token);
  });
  await page.goto("https://app.kosmi.io/room/" + argv.room_id);
  await page.evaluate(() => {
    window.isHeadless = true;
  });
  page.on("console", (msg) => console.log(msg._text));
  await page.waitForSelector("#start_server_btn-Okb");
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].filter(
      (b) => b.innerText === "Start Server"
    )[0];
    btn.click();
  });
})();

const puppeteer = require("puppeteer");
const argv = require('minimist')(process.argv.slice(2));


let qstr = "";
if(argv.map)
    qstr = qstr + "&map=" + argv.map;
if(argv.game_type)
    qstr = qstr + "&game_type=" + argv.game_type;
if(argv.game_mode)
    qstr = qstr + "&game_mode=" + argv.game_mode;


(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding"
    ]
  });
  const page = await browser.newPage();

  await page.goto(
    "https://openarena.live/" +
      Math.random()
        .toString(36)
        .substring(7) +
      "?dedicated" + qstr
  );
  page.on("console", msg => console.log(msg._text));
  await page.waitForSelector(".quake_container");
  await page.evaluate(() => {
    const btn = document.querySelector(".quake_container button");
    btn.click();
  });
})();

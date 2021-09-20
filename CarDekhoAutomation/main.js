let fs = require("fs");
let path = require("path");
let puppeteer = require("puppeteer");
let page;
let dirPath = "C:\\Users\\HP\\Documents\\CarDekhoAutomation";

let cardirPath = path.join(dirPath, "CarDekho");
if (fs.existsSync(cardirPath)) {
  console.log("Directory Already Exists");
} else {
  fs.mkdirSync(cardirPath);
  (async function fn() {
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    });

    page = await browser.newPage();
    await page.goto("https://www.cardekho.com/");
    await page.waitForSelector('a[title="New Car"]');
    await page.click('a[title="New Car"]');
    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(".viewmore span");
    await page.click(
      ".tabTitle .gsc_ta_scroll .gsc-ta-clickWrap .gsc-ta-active"
    );

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Maruti"]'
    );
    await getdata();
    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Hyundai"]'
    );
    await getdata();
    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Honda"]'
    );
    await getdata();

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Tata"]'
    );
    await getdata();

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Ford"]'
    );
    await getdata();

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Mahindra"]'
    );
    await getdata();

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Renault"]'
    );
    await getdata();

    await page.waitForSelector(
      ".gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 .BrIconNewCar"
    );

    await page.click(
      '.gsc_col-xs-4.gsc_col-sm-3.gsc_col-md-3.gsc_col-lg-2 a[href="/cars/Datsun"]'
    );
    await getdata();
  })();
}
async function getdata() {
  await page.waitForSelector(
    ".gsc_col-sm-12.gsc_col-xs-12.gsc_col-md-8.listView.holder.posS h3 a"
  );

  let carNames = await page.$$(
    ".gsc_col-sm-12.gsc_col-xs-12.gsc_col-md-8.listView.holder.posS h3 a"
  );

  await page.waitForSelector(
    ".gsc_col-sm-12.gsc_col-xs-12.gsc_col-md-8.listView.holder.posS .price"
  );

  let price = await page.$$(
    ".gsc_col-sm-12.gsc_col-xs-12.gsc_col-md-8.listView.holder.posS .price"
  );
  await page.waitForSelector(".dotlist span:nth-child(2)");

  let petrol = await page.$$(".dotlist span:nth-child(2)");
  let transmission = await page.$$(".dotlist span:nth-child(3)");
  let cars = [];
  let fileName = await page.evaluate(function fn(element) {
    return element.textContent.slice(0, 6);
  }, carNames[0]);

  for (let i = 0; i < carNames.length; i++) {
    let nameNpriceObj = await page.evaluate(
      getcarNames,
      carNames[i],
      price[i],
      petrol[i],
      transmission[i]
    );
    cars.push(nameNpriceObj);
  }

  let filePath = path.join(cardirPath, fileName);
  fs.writeFileSync(filePath + ".json", JSON.stringify(cars));

  await page.waitForSelector(
    ".gsc_container.gsc_container_hold.breadcrumb span:nth-child(2)"
  );
  await page.click(
    ".gsc_container.gsc_container_hold.breadcrumb span:nth-child(2)"
  );
  await page.waitForSelector(".viewmore span");
  await page.click(".viewmore span");
  await page.click(".tabTitle .gsc_ta_scroll .gsc-ta-clickWrap .gsc-ta-active");
  page.waitFor(5000);
}

function getcarNames(element1, element2, element3, element4) {
  return {
    CarName: element1.textContent,
    Price: element2.textContent.slice(0, 20),
  };
}

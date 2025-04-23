const puppeteer = require("puppeteer");

const runPuppeteer = async (username, password, semoption) => {
  const browser = await puppeteer.launch({
    headless: false,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  page.on("console", (consoleMessage) => {
    if (consoleMessage.type() === "log") {
      console.log("Console log:", consoleMessage.text());
    } else if (consoleMessage.type() === "error") {
      console.error("Console error:", consoleMessage.text());
    }
  });

  await page.goto("https://feebank.in/Account/Login");

  const email_elem = "input#Email";
  const email = username;
  await page.type(email_elem, email);

  const password_elem = "input#Password";
  const inputData = password;
  await page.type(password_elem, inputData);

  await page.click(`button[value="Log in"]`);

  // await page.waitForNavigation({ timeout: 60000 }); // 60s timeout

  // // await page.evaluate(() => {
  // //   if (document.getElementsByClassName("text-danger")[0].textContent == "Invalid login attempt." ) {
  // //     console.log("galt data aaya hai");
  // //     throw new Error("Invalid Credentials");
  // //   } else {
  // //     console.log("sahi detail hai");
  // //   }
  // // });

  // await page.goto("https://feebank.in/Students/AttendanceReport", { waitUntil: 'domcontentloaded' });



  
// Wait for either navigation OR error message to appear
const response = await Promise.race([
  page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10000 }).then(() => "success"),
  page.waitForSelector(".text-danger", { timeout: 10000 }).then(() => "error")
]);

if (response === "error") {
  const errorMessage = await page.evaluate(() => {
    return document.querySelector(".text-danger").textContent.trim();
  });
  console.log("❌ Login failed:", errorMessage);
  await browser.close();
  throw new Error("Invalid Credentials");
}

console.log("✅ Login successful, navigating...");
await page.goto("https://feebank.in/Students/AttendanceReport", { waitUntil: "domcontentloaded" });

  const selectElementSelector = "#PlanId";
  const optionValueToSelect = semoption;

  await page.waitForSelector(selectElementSelector);
  await page.select(selectElementSelector, optionValueToSelect);
  await page.waitForNavigation();

  let data = await page.evaluate(() => {
    window.complete_attobj = {};
    let subnums = [];
    var tabs = document.body.getElementsByTagName("a");
    let sub_names = {};

    for (const element of tabs) {
      try {
        if (element.role == "tab") {
          let subnumber = parseInt(
            element.onclick
              .toString()
              .replaceAll("function onclick(event) {\ngetStudentRecords(", "")
              .replaceAll(")\n}", "")
          );
          sub_names[subnumber] = element.textContent;
          subnums.push(subnumber);
        }
      } catch {}
    }

    return { subnums, sub_names };
  });

  var sub_names = data.sub_names;
  var sub_nums = data.subnums;

  var cobj = await page.evaluate(
    async (sub_names, subnums) => {
      const complete_attobj = {};

      async function processSubject(sub_num) {
        const subject = sub_names[`${sub_num}`];
        // console.log("**************************************");
        console.log(subject);

        getStudentRecords(sub_num);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        let Ab = 0,
          Pr = 0;
        let arr = document.getElementsByTagName("td");
        for (const element of arr) {
          try {
            if (
              element.firstElementChild.textContent === "(A)" ||
              element.firstElementChild.textContent === "(S)"
            ) {
              Ab++;
            } else if (
              element.firstElementChild.textContent === "(P)" ||
              element.firstElementChild.textContent === "(O)"
            ) {
              Pr++;
            }
          } catch {}
        }

        // console.log("Total Lectures = ", Ab + Pr);
        // console.log("Total Presents = ", Pr);
        // console.log("Total Absents = ", Ab);
        // console.log("Percentage = ", (Pr / (Pr + Ab)) * 100);

        let d = Ab + Pr;
        let n = d - Ab;
        let advice = "";

        let lec_to_be_attended = 0;
        let bunk = -1;

        const percentage = (n / d) * 100;

        if (percentage == 75) {
          advice = "Cannot Miss The Next Class";
        } else if (percentage < 75) {
          while ((n / d) * 100 < 75) {
            n++;
            d++;
            lec_to_be_attended++;
          }
          advice = `Attend Next ${lec_to_be_attended} Classes`;
        } else if (percentage > 75) {
          while ((n / d) * 100 >= 75) {
            bunk++;
            d++;
          }
          if (bunk == 0) {
            advice = "Cannot Miss The Next Class";
          } else {
            advice = `Can Skip Next ${bunk} Lectures`;
          }
        }

        let attobj = { TL: Ab + Pr, Pr: Pr, Ab: Ab, Advice: advice };
        complete_attobj[subject] = attobj;
      }

      async function iterateSubjects() {
        for (const sub_num of subnums) {
          await processSubject(sub_num);
        }
      }

      await iterateSubjects();

      return complete_attobj;
    },
    sub_names,
    sub_nums
  );

  //   await page.screenshot({ path: "screenshot.png" });
  await browser.close();
  return cobj;
};

module.exports = runPuppeteer;

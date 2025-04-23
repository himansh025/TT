const express = require("express");
const router = express.Router();

router.post("/teacher_timetable", async (req, res) => {
  const { req_day, teacherCode } = req.body;
  let ttt = {
    1: [null, null, null, null],
    2: [null, null, null, null],
    3: [null, null, null, null],
    4: [null, null, null, null],
    5: [null, null, null, null],
    6: [null, null, null, null],
    7: [null, null, null, null],
  };

  console.log(req.body);

  let collection = req.cln;

  if (!teacherCode || !req_day) {
    res.status(400).json({ error: "Either Teacher or Day is Not Selected !" });
    return;
  }

  let day_today = req_day;
  // console.log(day_today,"day_today");

  if (day_today == "sunday") {
    return res.status(401).json({ error: "Today is Sunday !" });
  }

  let allclasses = await collection.find({ day: req_day }).toArray();
  // console.log(allclasses);

  for (const cls of allclasses) {
    // console.log(cls.class);
    // console.log(cls[day_today]);

    let daytoday_tt_of_class = cls["timetable"];

    // console.log(daytoday_tt_of_class);

    for (let i = 0; i < 7; i++) {
      // const element = array[i];
      // console.log(daytoday_tt_of_class[i]);
      // console.log(
      //   daytoday_tt_of_class[i][0] == daytoday_tt_of_class[i][1] &&
      //     daytoday_tt_of_class[i][0] == daytoday_tt_of_class[i][1]
      // );

      if ((
        daytoday_tt_of_class[i][0] == daytoday_tt_of_class[i][1] &&
        daytoday_tt_of_class[i][0] == daytoday_tt_of_class[i][1]) && daytoday_tt_of_class[i][1]
      ) {
        // console.log("string",daytoday_tt_of_class[i]);
        str = daytoday_tt_of_class[i][1];
        let domains = str.split("|");
        let farr = domains.map((data) => {
          return data.split("-");
        });
        // console.log(farr, "farr");

        for (const domainlec of farr) {

          // console.log(domainlec);
          if (domainlec[1] && domainlec[1].trim() == teacherCode) {
            ttt[i + 1] = [cls.class, domainlec[0], teacherCode, domainlec[2]];
          }
        }
      } else {
        // console.log(daytoday_tt_of_class[i][1]);
        let teachername = daytoday_tt_of_class[i][1];
        if (teachername == teacherCode) {
          // console.log(teachername);
          ttt[i + 1] = [
            cls.class,
            daytoday_tt_of_class[i][0],
            teachername,
            daytoday_tt_of_class[i][2],
          ];
        } else if (daytoday_tt_of_class[i][1] == "Friday") {
          ttt[i + 1] = ["It", "Is", "Friday", "Meeting"];
        }
        else if (daytoday_tt_of_class[i][1] == "Departmental" || daytoday_tt_of_class[i][1] == "DEPARTMENTAL MEETING") {
          ttt[i + 1] = ["It", "Is", "Departmental", "Meeting"];
        }
      }
    }
  }

  res.json(ttt);
});

module.exports = router;

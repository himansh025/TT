const express = require("express");
const getIndianDate = require("../function_files/time");
const router = express.Router();

const lectureTimeArr = [
  "9:00",
  "10:05",
  "11:25",
  "12:30",
  "1:35",
  "2:40",
  "3:40",
];

const lecTeller = () => {
  let dateobj = getIndianDate();
  const day = dateobj.getDay();
  const h = dateobj.getHours();
  const m = dateobj.getMinutes();
  const s = dateobj.getSeconds();
  const time = h * 10000 + m * 100 + s;
  // console.log(time);

  if (time >= 80001 && time <= 90000) {
    lectureNumber = 0;
  } else if (time >= 90001 && time <= 100000) {
    lectureNumber = 1;
  } else if (time >= 100001 && time <= 110500) {
    lectureNumber = 2;
  } else if (time >= 110501 && time <= 112500) {
    lectureNumber = "Break";
  } else if (time >= 112501 && time <= 122500) {
    lectureNumber = 3;
  } else if (time >= 122501 && time <= 133000) {
    lectureNumber = 4;
  } else if (time >= 133001 && time <= 143500) {
    lectureNumber = 5;
  } else if (time >= 143501 && time <= 154000) {
    lectureNumber = 6;
  } else if (time >= 154001 && time <= 164000) {
    lectureNumber = 7;
  } else {
    lectureNumber = 404;
  }

  switch (day) {
    case 1:
      dayname = "monday";
      break;
    case 2:
      dayname = "tuesday";
      break;
    case 3:
      dayname = "wednesday";
      break;
    case 4:
      dayname = "thursday";
      break;
    case 5:
      dayname = "friday";
      break;
    case 6:
      dayname = "saturday";
      break;
    case 0:
      dayname = "sunday";
  }

  // console.log(lectureNumber);

  return [lectureNumber, dayname];
  // return [0, "monday"];
};

router.post("/", async (req, res) => {
  try {
    let final_Arr = [];
    const { cls } = req.body;

    // console.log("class : ", cls);

    if (!cls) {
      res.status(400).json({ error: "No class Found !" });
      return;
    }

    let collection = req.cln;
    // console.log(collection);

    let data = lecTeller();
    let dayname = data[1];
    let lectureNow_num = data[0];
    // console.log(data);
    // let lectureNext = 2



    if (dayname == "sunday") {
      return res.send([
        {
          id: 0,
          status: "sunday",
          subject: "Today",
          teacher: "Is",
          venue: "sunday",
          type: "sunday",
        },
      ]);
    }

    if (lectureNow_num == 404) {
      return res.send([
        {
          id: 0,
          status: "now",
          subject: "College",
          teacher: "Is",
          venue: "Closed",
          type: "closed",
        },
      ]);
    }

    // console.log(dayname);
    const results = await collection
      .find({ class: cls, day: dayname })
      .toArray();

    // console.log(results[0])

    if (!results.length) {
      return res.status(404).json({ error: "Class not in db" });
    }

    // console.log(results);

    let newTT = results[0]["timetable"];
    // console.log("new tt",newTT)
    leftTT = newTT.slice(lectureNow_num - 1);
    // console.log("keft tt",newTT)

    if (lectureNow_num === "Break") {
      // Insert break slot as "now"
      final_Arr.push({
        id: "break",
        status: "now",
        subject: "Tea Break",
        teacher: "-",
        venue: "-",
        time: "11:05 - 11:25",
        type: "break",
      });


      const breakIndex = newTT.findIndex(l => l[0] === "Break");
      const afterBreakTT = newTT.slice(breakIndex + 1); // skip past lectures
      // console.log(breakIndex,afterBreakTT)
      afterBreakTT.slice(2).forEach((lecture) => {
        const subjectText = lecture[0];
        let temptype = "lecture";

        if (/PLACEMENT/i.test(subjectText)) {
          temptype = "placement";
        } else if (/LUNCH/i.test(lecture[1]) || /LUNCH/i.test(subjectText)) {
          temptype = "Lunch break";
        } else if (/FREE/i.test(subjectText) || /Free/i.test(lecture[1])) {
          temptype = "idle";
        } else if (/MERN|Android|UI\/UX|LIVE PROJECT/i.test(subjectText)) {
          temptype = "major_project";
        }

        const lectureIndex = newTT.indexOf(lecture);
        const lectureTime = lectureTimeArr[lectureIndex];

        final_Arr.push({
          id: lectureIndex + 1,
          status: "upcoming",
          subject: subjectText,
          teacher: lecture[1],
          venue: lecture[2],
          time: lectureTime,
          type: temptype,
        });
      });

    } else {

      leftTT.forEach((lecture, idx) => {
        const subjectText = lecture[0];
        let temptype = "lecture";

        if (/PLACEMENT/i.test(subjectText)) {
          temptype = "placement";
        } else if (/LUNCH/i.test(lecture[1]) || /LUNCH/i.test(subjectText)) {
          temptype = "Lunch break";
        } else if (/FREE/i.test(subjectText) || /Free/i.test(lecture[1])) {
          temptype = "idle";
        } else if (/MERN|Android|UI\/UX|LIVE PROJECT/i.test(subjectText)) {
          temptype = "major_project";
        }

        const lectureIndex = newTT.indexOf(lecture);
        const isNow = idx === 0; // only first lecture = now
        const lectureTime = lectureTimeArr[lectureIndex];

        final_Arr.push({
          id: lectureIndex + 1,
          status: isNow ? "now" : "upcoming",
          subject: subjectText,
          teacher: lecture[1],
          venue: lecture[2],
          time: lectureTime,
          type: temptype,
        });
      });
    }



    res.send(final_Arr);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;

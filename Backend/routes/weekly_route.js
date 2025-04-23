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

router.post("/", async (req, res) => {
  try {
    let final_Arr = [];
    const { cls, reqday } = req.body;

    let collection = req.cln;
    // console.log(collection);

    let dayname = reqday;
    // let lectureNext = 2

    if (!cls) {
      res.status(400).json({ error: "No class Found !" });
      return;
    }

    if (!reqday) {
      res.status(400).json({ error: "No Day Found !" });
      return;
    }

    console.log(dayname);
    const results = await collection
      .find({ class: cls, day: dayname })
      .toArray();

    console.log(results);

    if (results.length == 0) {
      return res.status(400).json({ error: "No Data Found in Db !" });
    }

    let newTT = results[0]["timetable"];

    newTT.map((lecture) => {
      // console.log(lecture);
      let temptype = "lecture";

      if (
        lecture[0].includes("PLACEMENT") ||
        lecture[0].includes("Placement")
      ) {
        temptype = "placement";
      } else if (lecture[0].includes("Lunch") || lecture[0].includes("LUNCH")) {
        temptype = "lunch break";
      } else if (lecture[0].includes("Free") || lecture[0].includes("FREE")) {
        temptype = "idle";
      } else if (
        lecture[0].includes("MERN") ||
        lecture[0].includes("Android") ||
        lecture[0].includes("UI/UX")
      ) {
        temptype = "major_project";
      } else if (
        lecture[0].includes("DEPARTMENTAL") ||
        lecture[0].includes("departmental")
      ) {
        temptype = "departmental_meeting";
      }

      if (temptype == "major_project") {

        str = lecture[0];
        let domains = str.split("|");
        let farr = domains.map((data) => {
          return data.split("-");
        });
        // console.log(farr);

        final_Arr.push({
          id: newTT.indexOf(lecture) + 1,
          status: newTT.indexOf(lecture) == 0 ? "now" : "upcoming",
          data: farr.map((lecdata) => {
            return {
              subject: lecdata[0],
              teacher: lecdata[1],
              venue: lecdata[2],
            };
          }),
          time: lectureTimeArr[newTT.indexOf(lecture)],
          type: temptype,
        });
      } else {
        // console.log(lecture);
        final_Arr.push({
          id: newTT.indexOf(lecture) + 1,
          status: newTT.indexOf(lecture) == 0 ? "now" : "upcoming",
          subject: lecture[0],
          teacher: lecture[1],
          venue: lecture[2],
          time: lectureTimeArr[newTT.indexOf(lecture)],
          type: temptype,
        });
      }
    });

    res.send(final_Arr);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;

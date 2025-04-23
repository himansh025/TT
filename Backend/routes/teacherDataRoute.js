const express = require("express");

const router = express.Router();

router.post("", async (req, res) => {
  let DayArray = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const { teacherCode } = req.body;
  var teacherDataObj = { teacherCode };

  console.log(teacherCode);

  if (!teacherCode) {
    return res.status(400).json({ error: "No Teacher Code Found !" });
  }
  // ***********************************************************************

  DayArray.forEach(async (day) => {
    let timetableCln = req.cln;

    //   console.log(timetableCln);

    let allclasses = await timetableCln.find({ day: day }).toArray();

    // console.log(allclasses.length);

    allclasses.forEach(async (oneClsObj) => {
      oneClsObj["timetable"].forEach(async (oneLecture) => {
        if (oneLecture[1] == teacherCode) {


          console.log(oneLecture, oneClsObj.class, day);
          if (teacherDataObj[oneLecture[0]]) {
            teacherDataObj[oneLecture[0]] = teacherDataObj[oneLecture[0]] + 1;
          } else {
            teacherDataObj[oneLecture[0]] = 1;
          }

          
        }
      });
    });

    // ***********************************************************************
  });

  setTimeout(() => {
    res.json(teacherDataObj);
  }, 3000);
});

module.exports = router;

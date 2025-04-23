const express = require("express");
const router = express.Router();

router.post("", async (req, res) => {
  try {
    console.log("Server Request : ", req.body);

    var AllTheoryVenueList = [
      "ET-101", "ET-102", "ET-103", "ET-201", "ET-202", "ET-203", 
      "ET-301", "ET-302", "ET-303", "ET-401", "ET-402", "ET-403", 
      "ET-411", "ET-501", "ET-502", "ET-503", "ET-504", "ET-505"
    ];

    var AllLabVenueList = [
      "MTCL-1", "MTCL-2", "MTCL-3", "HMCL", "ETCC-206", 
      "ETCC-304", "ETCC-407", "ETCC-507", "PHYSICS-LAB", "LANG-LAB"
    ];

    const { reqday, lectureindex } = req.body;

    if (!reqday || lectureindex === undefined || lectureindex > 6) {
      return res.status(400).json({ message: "Day or Time Not defined" });
    }

    let collection = req.cln;
    if (!collection) {
      return res.status(500).json({ message: "Database collection not found" });
    }

    let timetable = await collection.find({ day: reqday }).toArray();

    for (const clss of timetable) {
      let busyvenue = clss?.["timetable"]?.[lectureindex]?.[2];

      if (busyvenue) {
        console.log(busyvenue, clss["class"]);

        let theoryIndex = AllTheoryVenueList.indexOf(busyvenue);
        if (theoryIndex !== -1) {
          AllTheoryVenueList.splice(theoryIndex, 1);
        }

        let labIndex = AllLabVenueList.indexOf(busyvenue);
        if (labIndex !== -1) {
          AllLabVenueList.splice(labIndex, 1);
        }
      }
    }

    console.log("Server Response : ", [AllTheoryVenueList, AllLabVenueList]);

    res.status(200).json([AllTheoryVenueList, AllLabVenueList]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

const express = require("express");
const connectToMongoDB = require("./database");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");
var cln;

// ***************************************************************

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");

// ***************************************************************

const db_connect = async () => {
  cln = await connectToMongoDB();

  await connectDB();

  // console.log(cln);
};
db_connect();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204 for preflight requests
};

app.use(cors(corsOptions));

app.use(async (req, res, next) => {
  req.cln = cln; // Pass the variable to every request
  // console.log(await cln.find({}).toArray());
  next(); // Continue to the next middleware or route handler
});

app.use(express.json());


// Use the upload route
app.use("/upload", require("./routes/upload_route"));

app.use("/live", require("./routes/live_route"));
app.use("/weekly", require("./routes/weekly_route"));

app.use("/attendance", require("./routes/attendanceRoute"));

app.use("/vacant_venue", require("./routes/vacantRoute"));

app.use("/teacher_data",require("./routes/teacherDataRoute"))

app.use("/", require("./routes/locateTeacherRoute"));

app.use("/api/auth", authRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/classes", classRoutes);




// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve index.html for React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});

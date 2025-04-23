const express = require("express");
const { decrypt } = require("../function_files/decrypt");
const runPuppeteer = require("../function_files/algorithm");
// const send_email = require("../mailer");
const router = express.Router();

const display = async (data) => {
  let template = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendance Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>

<h2>Attendance Report</h2>

<table id="attendanceTable">
<thead>
<tr>
      <th>Subject</th>
      <th>Total Lectures</th>
      <th>Presents</th>
      <th>Absents</th>
      <th>Percentage (%)</th>
      <th>Advice</th>
    </tr>
  </thead>
  <tbody>
  {tbody}
  </tbody>
</table>
</body>
</html>
`;
  var tbody = "";

  for (const [subject, info] of Object.entries(data)) {
    let p = (info.Pr / info.TL) * 100;
    tbody =
      tbody +
      `<tr>
    <td>${subject}</td>
    <td>${info.TL}</td>
    <td>${info.Pr}</td>
    <td>${info.Ab}</td>
    <td>${p}</td>
    <td>${info.Advice}</td>
    </tr>
    `;
  }

  // console.log(tbody);
  return template.replace("{tbody}", tbody);
};

router.post("/", async (req, res) => {
  console.log(
    req.body.username,
    req.body.password,
    req.body.email,
    req.body.option
  );
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.email ||
    !req.body.option
  ) {
    res.status(400).json({ error: "No Credentials Found" });
    return 0;
  }

  let username = decrypt(req.body.username);
  let password = decrypt(req.body.password);
  let email = decrypt(req.body.email);
  let option = decrypt(req.body.option);

  console.log(username, password, email, option);

  try {
    var result = await runPuppeteer(username, password, option);
    console.table(result);
    res
      .status(200)
      .json({ message: "You will receive Attendance Report on Email !" });
  } catch (err) {
    res.status(500).send({ error: err.message });
    console.log(err.message);
    // console.log(err);
    return 0;
  }

  try {
    var report = await display(result);
    console.log(report);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ error: err.message });
  }

  // Send an email with the report
  try {
    await send_email(email, report);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ error: err.message });
  }
});

module.exports = router;

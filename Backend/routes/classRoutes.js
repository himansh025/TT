const express = require("express");
const {
  AddClass,
  DeleteClass,
  GetAllClass,
} = require("../controllers/classControllers");

const router = express.Router();

router.post("/create", AddClass);

router.get("/getAll", GetAllClass);

router.delete("/delete", DeleteClass);

module.exports = router;

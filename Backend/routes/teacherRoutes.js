const express = require('express');
const { registerTeacher, loginTeacher, updateTeacher, getAllTeachers, deleteTeacher } = require('../controllers/teacherControllers');

const router = express.Router();

router.post('/register', registerTeacher);

router.post('/login', loginTeacher);

router.put('/update', updateTeacher);

router.get("/getAll", getAllTeachers);

router.delete("/delete", deleteTeacher);

module.exports = router;

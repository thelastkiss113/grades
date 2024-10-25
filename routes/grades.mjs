import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET route that sends grade data by _id
router.get("/by-id/:id", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grade = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!grade) return res.status(404).send("Grade not found.");
    res.send(grade);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET route that sends all data for a specified student_id
router.get("/student/:student_id", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grades = await collection.find({ student_id: parseInt(req.params.student_id) }).toArray();
    if (grades.length === 0) return res.status(404).send("No grades found for the specified student.");
    res.send(grades);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET route that sends all data for a specified class_id
router.get("/class/:class_id", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grades = await collection.find({ class_id: parseInt(req.params.class_id) }).toArray();
    if (grades.length === 0) return res.status(404).send("No grades found for the specified class.");
    res.send(grades);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET route that sends the data for a specified combination of student_id and class_id
router.get("/student/:student_id/class/:class_id", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grades = await collection.find({
      student_id: parseInt(req.params.student_id),
      class_id: parseInt(req.params.class_id)
    }).toArray();
    if (grades.length === 0) return res.status(404).send("No grades found for the specified student and class.");
    res.send(grades);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET route that sends the weighted average score for each class for a student
router.get("/student/:student_id/weighted-averages", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grades = await collection.find({ student_id: parseInt(req.params.student_id) }).toArray();
    if (grades.length === 0) return res.status(404).send("No grades found for the specified student.");

    const classWeightedAverages = {};
    grades.forEach(grade => {
      if (!classWeightedAverages[grade.class_id]) {
        classWeightedAverages[grade.class_id] = { totalScore: 0, totalWeight: 0 };
      }
      classWeightedAverages[grade.class_id].totalScore += grade.score * grade.weight;
      classWeightedAverages[grade.class_id].totalWeight += grade.weight;
    });

    const averages = Object.keys(classWeightedAverages).map(class_id => ({
      class_id: parseInt(class_id),
      weighted_average: classWeightedAverages[class_id].totalScore / classWeightedAverages[class_id].totalWeight
    }));

    res.send(averages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET route that sends the overall weighted average score for a student
router.get("/student/:student_id/overall-weighted-average", async (req, res) => {
  try {
    const collection = db.collection("grades");
    const grades = await collection.find({ student_id: parseInt(req.params.student_id) }).toArray();
    if (grades.length === 0) return res.status(404).send("No grades found for the specified student.");

    let totalScore = 0;
    let totalWeight = 0;

    grades.forEach(grade => {
      totalScore += grade.score * grade.weight;
      totalWeight += grade.weight;
    });

    const overallWeightedAverage = totalScore / totalWeight;
    res.send({ student_id: parseInt(req.params.student_id), overall_weighted_average: overallWeightedAverage });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;

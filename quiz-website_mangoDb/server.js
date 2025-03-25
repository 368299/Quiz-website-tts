const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const quizSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    score: Number
});

const Quiz = mongoose.model("Quiz", quizSchema);

// POST API to Save Data
app.post("/save", async (req, res) => {
    try {
        const { name, email, phone, score } = req.body;
        const newEntry = new Quiz({ name, email, phone, score });
        await newEntry.save();
        res.send("✅ Data saved to MongoDB");
    } catch (error) {
        res.status(500).send("❌ Error saving data");
    }
});

// GET API to Retrieve Data
app.get("/results", async (req, res) => {
    try {
        const results = await Quiz.find();
        res.json(results);
    } catch (error) {
        res.status(500).send("❌ Error retrieving data");
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    city: String,
});

const User = mongoose.model("User", userSchema);

// GET all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// POST new user
app.post("/users", async (req, res) => {
    try {
        const { name, age, city } = req.body;
        if (!name || !age || !city) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newUser = new User({ name, age, city });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// PUT (Update user)
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

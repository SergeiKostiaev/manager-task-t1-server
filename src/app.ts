import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", tasksRouter);

// Health check
app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
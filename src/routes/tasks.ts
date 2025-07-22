import express, { Request, Response } from "express";
import { Task } from "../types/task";
import { generateId, validateTaskData } from "../utils/helpers";

const router = express.Router();

// Хранилище задач в памяти
let tasks: Task[] = [
    {
        id: 1,
        title: 'Исправить ошибку авторизации',
        description: 'При нажатии на авторизоваться, не пускает в систему',
        category: 'Bug',
        status: 'To Do',
        priority: 'High',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Внести правки по макету Figma',
        description: 'Доступ к макету попросить у дизайнера',
        category: 'Refactor',
        status: 'To Do',
        priority: 'Low',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

router.get("/", (req: Request, res: Response) => {
    let result = [...tasks];

    // Фильтрация по названию
    if (req.query.title) {
        const titleFilter = req.query.title.toString().toLowerCase();
        result = result.filter(task =>
            task.title.toLowerCase().includes(titleFilter)
        );
    }

    // Фильтрация по дате
    if (req.query.date) {
        const dateFilter = new Date(req.query.date.toString());
        const dateFilterStr = dateFilter.toISOString().split('T')[0];
        result = result.filter(task =>
            new Date(task.createdAt).toISOString().split('T')[0] === dateFilterStr
        );
    }

    res.json(result);
});

router.get("/:id", (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});

router.post("/", (req: Request, res: Response) => {
    if (!validateTaskData(req.body)) {
        return res.status(400).json({ error: "Invalid task data" });
    }

    const newTask: Task = {
        id: generateId(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || 'Feature',
        status: req.body.status || 'To Do',
        priority: req.body.priority || 'Medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

router.patch("/:id", (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
});

router.delete("/:id", (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

export default router;
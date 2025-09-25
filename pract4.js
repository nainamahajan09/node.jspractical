const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let todos = [];
app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const newTodo = {
        id: todos.length + 1,
        title,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.listen(port, () => {
    console.log(`Todo API running at http://localhost:${port}`);
});

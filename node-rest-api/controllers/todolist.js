const { v4: uuidv4 } = require("uuid");
const ToDo = require("../models/todolist.js");

// Create to-do
const createTodo = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: "Text field is required." });
        }
        
        const newTodo = await ToDo.create({
            id: uuidv4(),         
            text,
            completed: false,
            userId: req.user.id   
        });
        
        const todoPlain = newTodo.toJSON ? newTodo.toJSON() : newTodo;
        
        res.status(201).json(todoPlain);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all to-dos for the current user
const getAllTodos = async (req, res) => {
    try {
        const allTodos = await ToDo.findAll();
        const userTodos = allTodos
            .filter(todo => todo.userId === req.user.id)
            .map(todo => todo.toJSON ? todo.toJSON() : todo);
        
        res.status(200).json(userTodos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a to-do for the current user
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;
        const allTodos = await ToDo.findAll();
        const todo = allTodos.find(t => t.id === id && t.userId === req.user.id);
        
        if (!todo) {
            return res.status(404).json({ message: "To-do not found." });
        }
        if (text !== undefined) todo.text = text;
        if (completed !== undefined) todo.completed = completed;
        
        await todo.save();
        
        const updatedTodo = todo.toJSON ? todo.toJSON() : todo;
        
        res.status(200).json(updatedTodo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a to-do for the current user
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const allTodos = await ToDo.findAll();
    const todo = allTodos.find(t => t.id === id && t.userId === req.user.id
    );

    if (!todo) {
      return res.status(404).json({ message: "To-do not found." });
    }

    await todo.deleteOne();

    res.status(200).json({ message: "To-do deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
    createTodo,
    getAllTodos,
    updateTodo,
    deleteTodo
};
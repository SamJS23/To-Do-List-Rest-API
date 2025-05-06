import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile.jsx";
import Auth from "./Authorization.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/info", {
          withCredentials: true, 
        });
        setUser(res.data); 
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos/gettodos", {
        withCredentials: true,
      });
      console.log("Fetched tasks:", res.data);
      setTasks(res.data); 
    } catch (err) {
      console.error("Failed to get tasks:", err);
      setTasks([]); 
    }
  };

  const addTask = async () => {
    if (task.trim() === "") return;

    if (editId) {
      try {
        const res = await axios.put(
          `http://localhost:5000/api/todos/updatetodo/${editId}`,
          { text: task },
          { withCredentials: true }
        );
        
        fetchTasks();
        
        setEditId(null);
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/todos/createtodo",
          { text: task },
          { withCredentials: true }
        );
        
    
        fetchTasks();
      } catch (err) {
        console.error("Failed to add task:", err);
      }
    }
    setTask("");
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/deletetodo/${id}`, {
        withCredentials: true,
      });
      
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) {
      console.error("Task not found:", id);
      return;
    }
    
    try {
      await axios.put(
        `http://localhost:5000/api/todos/updatetodo/${id}`,
        { completed: !taskToUpdate.completed },
        { withCredentials: true }
      );

      fetchTasks();
    } catch (err) {
      console.error("Failed to update task completion:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="navbar">
          <div className="nav-left">To-Do List App</div>
          <div className="nav-right">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="sign-out-btn">Sign Out</button>
          </div>
        </nav>
        <div className="content-container">
          <Routes>
            <Route path="/" element={
              <div className="todo-container">
                <h1 className="text-xl font-bold mb-4">To-Do List</h1>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="input-field"
                    placeholder="Enter a task"
                  />
                  <button onClick={addTask} className="add-btn">
                    {editId ? "Update" : "Add"}
                  </button>
                </div>
                <ul>
                  {tasks.length === 0 ? (
                    <li className="text-gray-500">No tasks yet. Add one above!</li>
                  ) : (
                    tasks.map((t) => (
                      <li key={t.id} className="task-item">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleComplete(t.id)}
                          className="mr-2"
                        />
                        <span className={t.completed ? "line-through" : ""}>
                          {t.text}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setTask(t.text);
                              setEditId(t.id);
                            }} 
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteTask(t.id)} 
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            } />
            <Route path="/profile" element={<div className="profile-container"><Profile /></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
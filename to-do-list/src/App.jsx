import { useState, useEffect } from "react";
import { auth, db } from "./firebase-config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Profile from "./Profile.jsx";
import Auth from "./Authorization.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        const q = query(collection(db, "todo"), where("userId", "==", user.uid));
        const taskSnapshot = await getDocs(q);
        setTasks(taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };
      fetchTasks();
    }
  }, [user]);

  const addTask = async () => {
    if (task.trim() === "") return;
    if (editId) {
      const taskRef = doc(db, "todo", editId);
      await updateDoc(taskRef, { text: task });
      setTasks(tasks.map((t) => (t.id === editId ? { ...t, text: task } : t)));
      setEditId(null);
    } else {
      const docRef = await addDoc(collection(db, "todo"), { 
        text: task, 
        completed: false,
        userId: user.uid 
      });
      setTasks([...tasks, { id: docRef.id, text: task, completed: false, userId: user.uid }]);
    }
    setTask("");
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "todo", id));
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = async (id) => {
    const taskRef = doc(db, "todo", id);
    await updateDoc(taskRef, { completed: !tasks.find((t) => t.id === id).completed });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
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
                  {tasks.map((t) => (
                    <li key={t.id} className="task-item">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleComplete(t.id)}
                        className="mr-2"
                      />
                      <span>{t.text}</span>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setTask(t.text);
                          setEditId(t.id);
                        }} className="edit-btn">Edit</button>
                        <button onClick={() => deleteTask(t.id)} className="delete-btn">Delete</button>
                      </div>
                    </li>
                  ))}
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
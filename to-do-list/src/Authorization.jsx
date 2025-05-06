import { useState } from "react";
import axios from "axios";

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      const url = isLogin ? `http://localhost:5000/api/user/signin` : `http://localhost:5000/api/user/signup`;
  
      const res = await axios.post(
        url,
        { email, password },
        { withCredentials: true }
      );
  
      if (isLogin) {
        const infoRes = await axios.get(`http://localhost:5000/api/user/info`, {
          withCredentials: true
        });
  
        setUser(infoRes.data);
      } else {
        alert("Sign up successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  


  return (
    <div className="auth-container">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="input-field" 
        placeholder="Email" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="input-field mt-2" 
        placeholder="Password" 
      />
      <button 
        onClick={handleAuth} 
        className="auth-btn mt-2">
        {isLogin ? "Login" : "Sign Up"}
      </button>
      <p className="mt-2 text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          className="auth-link"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Login"}
        </span>
      </p>
    </div>
  );
}

export default Auth;

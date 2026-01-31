import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(data);
      navigate("/"); 
    } catch (err) {
      alert("Invalid login details");
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Admin Login</h2>
        
        <input 
          type="text" placeholder="Username" required
          className="w-full p-2 mb-4 border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none"
          onChange={(e) => setData({...data, username: e.target.value})}
        />
        
        <input 
          type="password" placeholder="Password" required
          className="w-full p-2 mb-6 border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none"
          onChange={(e) => setData({...data, password: e.target.value})}
        />
        
        <button className="w-full bg-brand-primary text-white py-2 rounded-lg font-medium hover:opacity-90">
          Login
        </button>

        <p className="mt-4 text-sm text-center text-slate-500">
          New admin? <Link to="/register" className="text-brand-primary">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
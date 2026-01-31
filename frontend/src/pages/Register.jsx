import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const API_BASE_URL = "http://54.146.96.129:5000"; 

const Register = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      
      await axios.post(`${API_BASE_URL}/api/auth/register`, data);
      
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      
      const errorMsg = err.response?.data?.message || "Username might be taken or Server error";
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-brand-dark">Create Admin</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            placeholder="Enter username" 
            required
            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition"
            onChange={(e) => setData({...data, username: e.target.value})}
            value={data.username}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            required
            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition"
            onChange={(e) => setData({...data, password: e.target.value})}
            value={data.password}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-brand-primary text-white py-2 rounded-lg font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        
        <p className="mt-4 text-sm text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-primary font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

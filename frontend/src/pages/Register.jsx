import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Account created!");
      navigate("/login");
    } catch (err) {
      alert("Error: Username might be taken");
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Create Admin</h2>
        
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
          Register
        </button>
        
        <p className="mt-4 text-sm text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-primary">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
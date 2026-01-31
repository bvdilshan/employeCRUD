import { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; 

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext); 
  const [employees, setEmployees] = useState([]);
  const [dept, setDept] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", email: "", role: "", department: "IT", salary: "", status: "Active"
  });

  const fetchEmployees = async () => {
    try {
      const url = dept 
        ? `http://54.146.96.129:5000/api/employees?dept=${dept}` 
        : "http://54.146.96.129:5000/api/employees";
      const res = await axios.get(url);
      setEmployees(res.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  useEffect(() => {
    fetchEmployees();
  }, [dept]);

  
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
   
    const authData = JSON.parse(localStorage.getItem("user"));
    const token = authData?.token;

    if (!token) {
      alert(" session end");
      return;
    }

    
    const dataToSend = {
      ...formData,
      salary: Number(formData.salary)
    };

    
    const res = await axios.post(
      "http://54.146.96.129:5000/api/employees/add", 
      dataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    console.log("Success:", res.data);
    setShowModal(false);
    setFormData({ name: "", email: "", role: "", department: "IT", salary: "", status: "Active" });
    fetchEmployees();
    
  } catch (err) {
    
    console.error("Backend Error Response:", err.response?.data);
    alert("Error: " + (err.response?.data?.message || "Fail!"));
  }
};
 

const updateStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "Active" ? "Resigned" : "Active";
  try {
    const authData = JSON.parse(localStorage.getItem("user"));
    const token = authData?.token;

    await axios.put(
      `http://54.146.96.129:5000/api/employees/${id}`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } } 
    );
    fetchEmployees();
  } catch (err) {
    console.error("Update Error:", err.response?.data);
  }
};

const deleteEmployee = async (id) => {
  if (window.confirm("Are you sure you want to delete this employee?")) {
    try {
      const authData = JSON.parse(localStorage.getItem("user"));
      const token = authData?.token;

     
      await axios.delete(`http://54.146.96.129:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

     
      fetchEmployees();
    } catch (err) {
      console.error("Delete Error:", err.response?.data);
      alert("Error deleting employee: " + (err.response?.data?.message || "Server Error"));
    }
  }
};
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Staff Directory</h1>
          <p className="text-slate-500 italic">Logged in as: {user?.username}</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={logout}
            className="bg-white text-red-500 border border-red-100 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Logout
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-100"
          >
            + Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex items-center gap-4">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">Filter:</span>
        <select 
          className="bg-transparent border-none text-brand-primary font-bold outline-none cursor-pointer"
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="IT">Engineering / IT</option>
          <option value="HR">Human Resources</option>
          <option value="Sales">Sales & Marketing</option>
        </select>
      </div>

      <div className="grid gap-4">
        {employees.length > 0 ? employees.map(emp => (
          <div key={emp._id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100 hover:border-brand-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-brand-primary">
                {emp.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg text-brand-dark leading-tight">{emp.name}</p>
                <p className="text-slate-500 text-sm">{emp.role} • <span className="font-semibold text-slate-400">{emp.department}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Salary</p>
                <p className="font-mono font-bold text-slate-700">LKR {emp.salary?.toLocaleString()}</p>
              </div>

              <button 
                onClick={() => updateStatus(emp._id, emp.status)}
                className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition ${
                  emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}
              >
                {emp.status}
              </button>

              <button onClick={() => deleteEmployee(emp._id)} className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-lg transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-slate-400">No employees found in this department.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-brand-primary" 
                onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <input type="email" placeholder="Email Address" required className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-brand-primary"
                onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Role" required className="p-3 rounded-xl border border-slate-200 outline-none focus:border-brand-primary"
                  onChange={e => setFormData({...formData, role: e.target.value})} />
                
                <select className="p-3 rounded-xl border border-slate-200 outline-none"
                  onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <input type="number" placeholder="Monthly Salary" required className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-brand-primary"
                onChange={e => setFormData({...formData, salary: e.target.value})} />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:opacity-90 transition">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

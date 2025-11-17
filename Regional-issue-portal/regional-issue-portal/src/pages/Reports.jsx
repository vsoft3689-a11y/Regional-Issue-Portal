import { useEffect, useState } from "react";
import { getAllIssues, getIssueStatusCounts } from "../services/adminService";
import { getDepartments } from "../services/departmentService";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [departments, setDepartments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const loadData = async () => {
    try {
      const [deptRes, issueRes, statusRes] = await Promise.all([
        getDepartments(),
        getAllIssues(),
        getIssueStatusCounts(),
      ]);
      setDepartments(deptRes.data);
      setIssues(issueRes.data);
      const arr = Object.entries(statusRes.data).map(([k, v]) => ({
        name: k,
        value: v,
      }));
      setStatusData(arr);
    } catch {
      toast.error("Failed to load report data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const departmentCounts = departments.map((d) => ({
    name: d.name,
    value: issues.filter((i) => i.department?.name === d.name).length,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-background p-6">
      <h2 className="text-xl font-bold text-primary mb-6">Reports & Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Issue Status Distribution */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-primary font-semibold mb-3">Issue Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Issue Count */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-primary font-semibold mb-3">Department-wise Issues</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0a2342" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

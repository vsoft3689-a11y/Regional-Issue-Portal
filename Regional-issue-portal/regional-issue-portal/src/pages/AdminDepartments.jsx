import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";
import { toast } from "react-toastify";

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", description: "" });

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateDepartment(form.id, form);
        toast.success("Department updated");
      } else {
        await createDepartment(form);
        toast.success("Department created");
      }
      setForm({ id: null, name: "", description: "" });
      loadDepartments();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (dept) => {
    setForm(dept);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(id);
      toast.success("Deleted successfully");
      loadDepartments();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Manage Departments</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3 max-w-md"
      >
        <input
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          {form.id ? "Update Department" : "Add Department"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No departments found.
                </td>
              </tr>
            )}
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{dept.id}</td>
                <td className="px-4 py-2">{dept.name}</td>
                <td className="px-4 py-2">{dept.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

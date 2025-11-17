import { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../services/userService";
import { toast } from "react-toastify";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch {
      toast.error("Failed to load user info");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateUser(user);
      toast.success("Profile updated successfully");
      setEdit(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-[420px]">
        <h2 className="text-xl font-bold text-primary mb-4">My Profile</h2>
        <div className="flex flex-col gap-3">
          <input
            disabled={!edit}
            value={user.fullName || ""}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            disabled
            value={user.username || ""}
            className="border px-3 py-2 rounded bg-gray-100"
          />
          <input
            disabled={!edit}
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <p className="text-sm text-gray-600">Role: {user.role}</p>

          {edit ? (
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="bg-accent text-primary px-4 py-2 rounded hover:opacity-90"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

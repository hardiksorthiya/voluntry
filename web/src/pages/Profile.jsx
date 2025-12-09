import { useEffect, useState } from "react";
import client from "../api/client";

const defaultProfile = {
  bio: "",
  skills: "",
  availability: "flexible",
  location: "",
  avatarUrl: "",
};

const Profile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [status, setStatus] = useState("");

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const { data } = await client.get("/users/me");
      setProfile({
        bio: data.user?.profile_bio ?? "",
        skills: Array.isArray(data.user?.profile_skills) 
          ? data.user.profile_skills.join(", ") 
          : (data.user?.profile_skills || ""),
        availability: data.user?.profile_availability ?? "flexible",
        location: data.user?.profile_location ?? "",
        avatarUrl: data.user?.profile_avatarUrl ?? "",
      });
    } catch (error) {
      setStatus(error.response?.data?.message ?? "Failed to load profile");
    }
  };
  fetchProfile();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    await client.put("/users/me", {
      ...profile,
      skills: profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
    setStatus("Profile updated ✅");
  } catch (error) {
    setStatus(error.response?.data?.message ?? "Update failed");
  }
  };

  const handleDelete = async () => {
  try {
    await client.delete("/users/me");
    setStatus("Profile deleted");
  } catch (error) {
    setStatus(error.response?.data?.message ?? "Delete failed");
  }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <textarea
          rows={3}
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <input
          placeholder="Skills (comma separated)"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
        />
        <input
          placeholder="Availability"
          value={profile.availability}
          onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
        />
        <input
          placeholder="Location"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
        <input
          placeholder="Avatar URL"
          value={profile.avatarUrl}
          onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
        />
        <button type="submit">Save profile</button>
      </form>
      <button className="danger" onClick={handleDelete}>
        Delete profile
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Profile;


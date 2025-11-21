import React, { useEffect, useState } from "react";
import { type PageProps } from "@/types/page.type";
import PageLayout from "~/app/components/templates/layout/page.layout";
import { authService } from "~/app/services/auth.service";
import { userService } from "~/app/services/user.service";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/atoms/card";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface ProfileData {
  _id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
  program?: string;
  avatar?: string;
}

const programs = ["BSIT", "BSBA"]; // Replace with actual programs

const Profile = ({ userRole, userName, onLogout }: PageProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const user = getUserFromLocalStorage()?.user;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.get(user?._id || "");
        setProfile(response);
        setAvatarPreview(response.avatar || null);
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?._id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !profile?._id) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", avatarFile);
      const res = await userService.upload(profile._id, formData);

      const imageUrl = res?.data?.url || res?.url;
      if (!imageUrl) throw new Error("No image URL returned from server.");

      setProfile((prev) => (prev ? { ...prev, avatar: imageUrl } : prev));
      setMessage({ type: "success", text: "Avatar updated successfully." });
      setAvatarFile(null);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload avatar.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setLoading(true);
      await userService.patch(profile);
      setMessage({ type: "success", text: "Profile updated successfully." });
      setEditing(false);
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({ currentPassword, newPassword });
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-700">
            Welcome, {userName}!
          </h1>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !profile ? (
              <p>Loading profile...</p>
            ) : profile ? (
              <>
                <div className="flex flex-col items-center mb-6 space-y-2">
                  <img
                    src={
                      avatarPreview ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border shadow-sm"
                  />
                  <label className="text-sm text-gray-600 font-medium cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    Change Avatar
                  </label>
                  {avatarFile && (
                    <Button
                      onClick={handleUploadAvatar}
                      disabled={loading}
                      className="text-sm bg-green-600 hover:bg-green-700 text-white"
                    >
                      {loading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium text-gray-700">
                        Username
                      </label>
                      <Input
                        value={profile.userName || ""}
                        disabled={!editing}
                        onChange={(e) =>
                          setProfile({ ...profile, userName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">
                        First Name
                      </label>
                      <Input
                        value={profile.firstName}
                        disabled={!editing}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input
                        value={profile.lastName}
                        disabled={!editing}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">
                        Middle Name
                      </label>
                      <Input
                        value={profile.middleName || ""}
                        disabled={!editing}
                        onChange={(e) =>
                          setProfile({ ...profile, middleName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Email</label>
                      <Input value={profile.email} disabled />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Role</label>
                      <Input value={profile.role} disabled />
                    </div>
                    {profile.program && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Program
                        </label>
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={profile.program}
                          disabled={!editing}
                          onChange={(e) =>
                            setProfile({ ...profile, program: e.target.value })
                          }
                        >
                          {programs.map((prog) => (
                            <option key={prog} value={prog}>
                              {prog}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div className="flex gap-3 flex-wrap">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Edit Profile
                    </Button>
                  )}
                </form>
              </>
            ) : (
              <p>No profile data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Processing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Profile;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UploadPhoto } from "./../UploadPhoto/UploadPhoto";
import UserPost from "../UserPost/UserPost";
import { CreatePost } from "./../CreatePost/CreatePost";

export default function Profil() {
  async function getLoggedUserData() {
    try {
      let response = await axios.get(
        `https://linked-posts.routemisr.com/users/profile-data`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["loggedUserData"],
    queryFn: getLoggedUserData,
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }
  if (isError)
    return (
      <div className="text-center text-red-500 font-medium text-lg mt-10">
        Error: {error.message}
      </div>
    );
  console.log(data);

  const user = data.user;
  console.log(user);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 pt-20">
      {/* Create Post */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <CreatePost />
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32">
            <img
              src={user.photo}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* User Info */}
        <div className="mt-8 grid gap-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Gender:</span>
            <span className="text-gray-800">{user.gender}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">Date of Birth:</span>
            <span className="text-gray-800">{user.dateOfBirth}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Joined:</span>
            <span className="text-gray-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Upload Photo */}
        <div className="mt-6">
          <UploadPhoto />
        </div>
      </div>

      {/* User Posts */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Posts</h2>
        <UserPost idUser={user?._id} />
      </div>
    </div>
  );
}

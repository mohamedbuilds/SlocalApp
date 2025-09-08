import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UpdatePost } from "../UpdatePost/UpdatePost";
import { PostContext } from "../../Context/UserPost";
import { CreateComment } from "../CreateComment/CreateComment";

export default function UserPost({ idUser }) {
  let { deletePost } = useContext(PostContext);
  async function getUserPost() {
    try {
      let response = await axios.get(
        `https://linked-posts.routemisr.com/users/${idUser}/posts`,
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

  async function deletePostProfile(id) {
    try {
      await deletePost(id);
    } catch (error) {
      console.log(error);
    }
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPost"],
    queryFn: getUserPost,
  });
  console.log(data);

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

  return (
    <div className="flex flex-col gap-6 mt-6">
      {data.posts
        .slice()
        .reverse()
        .map((post) => (
          <div key={post._id || post.id} className="relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
              onClick={() => deletePostProfile(post._id || post.id)} // هنا تحط وظيفة الحذف
            >
              X
            </button>

            <Link to={`/componentsdetials/${post._id}`}>
              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.user?.photo}
                      alt={post.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {post.user?.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.body}</p>
                  {post.comments?.length > 0 && (
                    <p className="mt-2 text-gray-500 text-sm">
                      Comments: {post.comments.length}
                    </p>
                  )}
                </div>
              </div>
            </Link>
            <UpdatePost idUpdate={post._id || post.id} />
            <CreateComment idess={post._id || post.id}/>
          </div>
        ))}
    </div>
  );
}

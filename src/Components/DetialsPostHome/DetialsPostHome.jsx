import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CommentContext } from "../../Context/userComments";
import { UpdateComment } from "../UpdateComment/UpdateComment";


export default function DetialsPostHome() {
  let { DeleteCommentProfile } = useContext(CommentContext);
  let { id } = useParams();
  async function getSinglePost() {
    try {
      let response = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return response.data.post;
    } catch (error) {
      console.log(error);
      return null; 
    }
  }

  async function deletes(id) {
    await DeleteCommentProfile(id);
  }

  let { data, isLoading } = useQuery({
    queryKey: ["detilasPost", id],
    queryFn: getSinglePost,
  });

  if (isLoading) {
    return (
      <>
        <div className="loader-container ">
          <span class="loader"></span>
        </div>
      </>
    );
  }

  console.log(data);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Post Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={data?.user?.photo}
            alt={data?.user?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-lg">{data?.user?.name}</h2>
            <p className="text-gray-500 text-sm">
              {data?.createdAt && new Date(data?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post Image */}
        {data?.image && (
          <img
            src={data?.image}
            alt="Post"
            className="w-full max-h-[400px] object-cover rounded-lg mb-4"
          />
        )}

        {/* Post Body */}
        <p className="text-gray-800">{data?.body}</p>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="font-bold text-xl mb-4">
          Comments ({data?.comments?.length})
        </h3>
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {data?.comments.length > 0 ? (
            <>
              {data?.comments
                ?.slice()
                ?.reverse()
                ?.map((comment) => (
                  <div
                    key={comment?._id}
                    className="flex gap-4 p-3 border-b last:border-b-0"
                  >
                    <img
                      src={comment?.commentCreator?.photo}
                      alt={comment?.commentCreator?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="relative  rounded-lg bg-white shadow-sm flex w-full">
                      <div>
                        <h4 className="font-semibold">
                          {comment?.commentCreator?.name}
                        </h4>
                        <p className="text-gray-700">{comment?.content}</p>
                        <p className="text-gray-400 text-xs">
                          {comment?.createdAt &&
                            new Date(comment?.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-48 text-gray-500 text-lg italic">
              No comments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useContext } from "react";
import { PostContext } from "../../Context/UserPost";
import { Link } from "react-router-dom";

export default function Home() {
  let { data, isLoading } = useContext(PostContext);


  const alldataPost = data?.posts;

  console.log(alldataPost);
  if (isLoading) {
    return (
      <>
        <div className="loader-container ">
          <span class="loader"></span>
        </div>
      </>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alldataPost?.map((post) => (
          <Link to={`/detialsHome/${post?._id}`}>
            <div
              key={post?._id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3 hover:shadow-xl transition-shadow"
            >
              {/* معلومات المستخدم */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    post?.user?.photo ||
                    "https://linked-posts.routemisr.com/uploads/default-profile.png"
                  }
                  alt={post?.user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{post?.user?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* محتوى البوست */}
              <p className="text-gray-700">{post.body}</p>

              {/* الصورة لو موجودة */}
              {post?.image && (
                <img
                  src={post?.image}
                  alt="post"
                  className="w-full h-60 object-cover rounded-lg"
                />
              )}

              {/* أول تعليق لو موجود */}
              {post?.comments && post?.comments?.length > 0 && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">
                      {post?.comments[0]?.commentCreator?.name}:
                    </span>
                    {post?.comments[0]?.content}
                  </p>
                </div>
              )}

              {/* عدد التعليقات */}
              {post?.comments && post?.comments?.length > 1 && (
                <p className="text-gray-400 text-sm mt-1">
                  +{post?.comments?.length - 1} more comments
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

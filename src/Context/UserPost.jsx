import axios from "axios";
import { createContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export let PostContext = createContext();

export default function PostContextProvider(props) {
  let queryClient = useQueryClient();
  async function getAllPost() {
    try {
      let response = await axios.get(
        `https://linked-posts.routemisr.com/posts?limit=50`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      queryClient.invalidateQueries({queryKey: ['allPost']})
      return response.data;
    } catch (error) {
      console.log(error);
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  async function createPost(values) {
    try {
      let myData = new FormData();
      myData.append("body", values.body);
      myData.append("image", values.image[0]);
      let response = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
        myData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["userPost"], // أو أي key معرفتها في useQuery
      });
      toast.success("Post Adede successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to Aded post.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  async function updatePost(values, id) {
    try {
      let myData = new FormData();
      myData.append("body", values.body);
      myData.append("image", values.image[0]);
      let response = await axios.put(
        `https://linked-posts.routemisr.com/posts/${id}`,
        myData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["userPost"], // أو أي key معرفتها في useQuery
      });
      toast.success("Post updated successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to update post.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  async function deletePost(id) {
    try {
      let response = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["userPost"], // أو أي key معرفتها في useQuery
      });
      toast.success("Post deleted successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to deleted post.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  let { data, isLoading } = useQuery({
    queryKey: ["allPost"],
    queryFn: getAllPost,
  });

  return (
    <PostContext.Provider
      value={{
        data,
        isLoading,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
}

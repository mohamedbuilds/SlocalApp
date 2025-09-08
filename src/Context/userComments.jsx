import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";
import { toast } from "react-toastify";

export let CommentContext = createContext();

export default function ComentContextProvider(props) {
  let queryClient = useQueryClient();









  async function CreateCommentProfile(values) {
    try {
      let response = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        values,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Comment added successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }












  

  async function UpdateCommentProfile(id, content) {
    try {
      let response = await axios.put(
        `https://linked-posts.routemisr.com/comments/${id}`,
        {
          content,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      // toast.success("Comment added successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      // toast.error("Failed to add comment.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  async function DeleteCommentProfile(id) {
    try {
      let response = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${id}`,

        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["detilasPost"] });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to deleted comment.");
      return null; // أو ممكن ترجع قيمة افتراضية
    }
  }

  return (
    <CommentContext.Provider
      value={{
        CreateCommentProfile,
        UpdateCommentProfile,
        DeleteCommentProfile,
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
}

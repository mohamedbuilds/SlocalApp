"use client";

import { Button, Label, Modal, ModalBody, ModalHeader } from "flowbite-react";
import style from './CreateComment.module.css'
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CommentContext } from "./../../Context/userComments";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const commentSchema = z.object({
  content: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(200, "Comment cannot exceed 200 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Comment cannot be empty or spaces only",
    }),
  post: z.string(),
});
export function CreateComment({ idess }) {
  let queryClient = useQueryClient();
  let { CreateCommentProfile } = useContext(CommentContext);

  let form = useForm({
    defaultValues: {
      content: "",
      post: idess,
    },
    resolver: zodResolver(commentSchema),
  });

  let { register, handleSubmit, formState } = form;

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [load, setload] = useState(false);

  async function handleCreatPost(values) {
    try {
      setload(true);
      await CreateCommentProfile(values);
      queryClient.invalidateQueries({ queryKey: ["userPost"] });
           setOpenModal(false);
    } catch (error) {
      setload(false);
      console.log(error);
    } finally {
      setload(false);
    }
  }
  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

return (
  <>
    <Button
      onClick={() => setOpenModal(true)}
      className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200"
    >
      💬 Create Comment
    </Button>

    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <ModalHeader />
      <ModalBody className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-white text-center">
            Create Comment
          </h3>

          <form onSubmit={handleSubmit(handleCreatPost)} className="flex flex-col gap-4">
            {/* محتوى التعليق */}
            <div className="flex flex-col">
              <Label htmlFor="content" className="mb-1 text-white">
                Comment
              </Label>
              <input
                {...register("content")}
                id="content"
                placeholder="Write your comment..."
                className="border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white bg-gray-700"
              />
              {formState.errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.content.message}
                </p>
              )}
            </div>

            {/* حقل البوست المخفي */}
            <div>
              <input
                hidden
                id="post"
                type="text"
                {...register("post")}
              />
              {formState.errors.post && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.post.message}
                </p>
              )}
            </div>

            {/* زر الإرسال */}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex justify-center"
            >
              {load ? "⏳ Loading..." : "Create Comment"}
            </Button>
          </form>
        </div>
      </ModalBody>
    </Modal>
  </>
);

}

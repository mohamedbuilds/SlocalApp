"use client";

import { Button, Label, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useContext, useState } from "react";
// import { useForm } from "react-hook-form";

import { CommentContext } from "./../../Context/userComments";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updateCommentSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters"),
});

export function UpdateComment({ updateCommID }) {
  let queryClient = useQueryClient();
  let { UpdateCommentProfile } = useContext(CommentContext);

  let form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(updateCommentSchema),
  });

  let { register, handleSubmit, formState } = form;

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [load, setload] = useState(false);

  async function handleUpdateComment(values) {
    try {
      setload(true);
      await UpdateCommentProfile(updateCommID, values.content);
      queryClient.invalidateQueries({ queryKey: ["detilasPost"] });
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
      <Button className="text-black" onClick={() => setOpenModal(true)}>
        <button className="absolute top-2 right-8 text-blue-500 hover:text-blue-700">
          <i className="fas fa-edit"></i>
        </button>
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Creat Comment
            </h3>
            <form onSubmit={handleSubmit(handleUpdateComment)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="content">Your content</Label>
                </div>
                <input
                  {...register("content")}
                  id="content"
                  placeholder="text here"
                />
                {formState.errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.content.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="mt-4">
                {load ? "Loading..........." : "Update Comment"}
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

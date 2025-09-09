"use client";

import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useContext, useState } from "react";
import { PostContext } from "../../Context/UserPost";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  body: z
    .string()
    .min(5, "Post must be at least 5 characters")
    .max(500, "Post cannot exceed 500 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Post cannot be empty or spaces only",
    }),
  image: z
    .any()
    .refine((files) => files?.length > 0, {
      message: "Image is required",
    })
    .refine(
      (files) =>
        files?.[0]?.type === "image/jpeg" ||
        files?.[0]?.type === "image/png" ||
        files?.[0]?.type === "image/jpg",
      {
        message: "Only .jpg, .jpeg, or .png files are allowed",
      }
    ),
});

export function CreatePost() {
  const [loads, setloads] = useState(false)
  let { createPost } = useContext(PostContext);

  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
    resolver: zodResolver(postSchema),
  });

  let { register, handleSubmit, formState } = form;

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

async  function handleCreatPost(values) {
  try {
    setloads(true)
    await createPost(values);
     setOpenModal(false);
  } catch (error) {
    setloads(false)
  }finally{
    setloads(false)
  }
  }
  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  return (
    <>
      <Button
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setOpenModal(true)}
      >
        Create Post
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create Post
            </h3>
            <form onSubmit={handleSubmit(handleCreatPost)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email">Your email</Label>
                </div>
                <TextInput
                  {...register("body")}
                  id="text"
                  placeholder="text here"
                />
                {formState.errors.body && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.body.message}
                  </p>
                )}
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password">Your File</Label>
                </div>
                <TextInput id="file" type="file" {...register("image")} />
                {formState.errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.image.message}
                  </p>
                )}
              </div>
              <Button
                className="bg-blue-600  mt-4 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                {loads ? "⏳" : "Submit"}
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

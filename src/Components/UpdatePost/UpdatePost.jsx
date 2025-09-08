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

const updatePostSchema = z.object({
  body: z.string().min(5, "Post content must be at least 5 characters"),
  image: z
    .any()
    .refine((file) => file?.length === 0 || file?.[0] instanceof File, {
      message: "Invalid file format",
    }),
});

export function UpdatePost({ idUpdate }) {
  let { updatePost } = useContext(PostContext);

  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
    resolver: zodResolver(updatePostSchema),
  });

  let { register, handleSubmit, formState } = form;

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [load, setload] = useState(false);

  async function handleCreatPost(values) {
    try {
      setload(true);
      await updatePost(values, idUpdate);
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
      <Button className="bg-indigo-600 mb-4 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200 cursor-pointer">
        ✏️ Update Post
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Update Post
            </h3>
            <form onSubmit={handleSubmit(handleCreatPost)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email">Your email</Label>
                </div>
                <input
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
                <input id="file" type="file" {...register("image")} />
                {formState.errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.image.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="mt-4">
                {load ? "Loading..........." : "Submit"}
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

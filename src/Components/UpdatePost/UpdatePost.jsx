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
      className="bg-indigo-600 mb-4 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200 cursor-pointer"
    >
      ✏️ Update Post
    </Button>

    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <ModalHeader />
      <ModalBody className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white text-center">
            Update Post
          </h3>

          <form
            onSubmit={handleSubmit(handleCreatPost)}
            className="flex flex-col gap-4"
          >
            {/* نص البوست */}
            <div className="flex flex-col">
              <Label htmlFor="text" className="mb-1 text-white">
                Post Content
              </Label>
              <input
                {...register("body")}
                id="text"
                placeholder="text here"
                className="border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-gray-700"
              />
              {formState.errors.body && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.body.message}
                </p>
              )}
            </div>

            {/* رفع الصورة */}
            <div className="flex flex-col">
              <Label htmlFor="file" className="mb-1 text-white">
                Your File
              </Label>
              <input
                id="file"
                type="file"
                {...register("image")}
                accept="image/png, image/jpeg, image/jpg"
                className="border border-gray-600 rounded-md p-2 text-white placeholder-white bg-gray-700"
              />
              {formState.errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.image.message}
                </p>
              )}
            </div>

            {/* زر الإرسال */}
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex justify-center"
            >
              {load ? "⏳ Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      </ModalBody>
    </Modal>
  </>
);



}

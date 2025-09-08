import axios from "axios";
import { Button, Label, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export function UploadPhoto() {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Zod schema
  const schema = z.object({
    photo: z
      .any()
      .refine((files) => files?.length > 0, "You must select a file")
      .refine((files) => {
        if (!files || files.length === 0) return false;
        const file = files[0];
        return ["image/png", "image/jpg", "image/jpeg"].includes(file.type);
      }, "Invalid file type. Only PNG, JPG, and JPEG are allowed."),
  });

  const form = useForm({
    defaultValues: {
      photo: "",
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  async function handleChangePhoto(values) {
    const myData = new FormData();
    myData.append("photo", values.photo[0]);
    try {
      setLoading(true);
      const response = await axios.put(
        `https://linked-posts.routemisr.com/users/upload-photo`,
        myData,
        { headers: { token: localStorage.getItem("token") } }
      );

      if (response.data.message === "success") {
        toast.success("Photo updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update photo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button className="bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer px-4 py-2 rounded-lg shadow-md transition-all duration-200">
        📸 Update Photo
      </Button>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Change Photo
            </h3>
            <form onSubmit={handleSubmit(handleChangePhoto)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="photo">Upload Photo</Label>
                </div>
                <input
                  type="file"
                  {...register("photo")}
                  id="photo"
                  accept="image/png, image/jpeg, image/jpg"
                />
                {formState.errors.photo && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.photo.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4">
                {loading ? "Uploading..." : "Change Photo"}
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

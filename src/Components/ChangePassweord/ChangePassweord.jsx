import axios from "axios";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

export function ChangePassweord() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  // Zod schema للفلاديشن
  const schema = z.object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-])/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
    newPassword: z
      .string()
      .min(8, "New Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-])/,
        "New Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
  });

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(schema), // إضافة الفلاديشن هنا
  });

  let { register, handleSubmit, formState } = form;
  const { errors } = formState; // هتستخدمهم لعرض رسائل الخطأ

  async function handlecahmgepass(values) {
    try {
      let response = await axios.patch(
        `https://linked-posts.routemisr.com/users/change-password`,
        values,
        { headers: { token: localStorage.getItem("token") } }
      );
      console.log(response);
      if (response.data.message == "success") {
        localStorage.setItem("token", response.data.token);
        toast.success("Password changed successfully");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    }
  }

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  return (
    <>
      <Button className="text-black" onClick={() => setOpenModal(true)}>
        change Password
      </Button>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Changed Password
            </h3>
            <form onSubmit={handleSubmit(handlecahmgepass)}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password">Password</Label>
                </div>
                <TextInput
                  type="password"
                  {...register("password")}
                  id="password"
                  placeholder="Your Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="newPassword">New password</Label>
                </div>
                <TextInput
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

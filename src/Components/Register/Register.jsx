import { Label, TextInput, Card, Radio } from "flowbite-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  let navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const schema = z
    .object({
      name: z.string().min(2, "Please enter a valid name."),
      email: z.email("The email address looks invalid. Please try again."),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
        ),
      rePassword: z.string().min(8, "Please re-enter your password."),
      dateOfBirth: z
        .string()
        .min(1, "Please enter your date of birth.")
        .refine((date) => {
          const today = new Date();
          const dob = new Date(date);
          return dob <= today;
        }, "Date of birth cannot be in the future."),
      gender: z.enum(["male", "female"], "Please select your gender."),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords do not match. Please try again.",
      path: ["rePassword"],
    });

  let form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState } = form;

  async function handelRegister(values) {
    // Call Api
    try {
      setloading(true);
      let response = await axios.post(
        `https://linked-posts.routemisr.com/users/signup`,
        values
      );
      console.log(response.data);
      if (response.data.message == "success") {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.error);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600">
      <Card className="w-full max-w-md bg-gray-900 shadow-xl border-0">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Register
        </h2>
        <form
          onSubmit={handleSubmit(handelRegister)}
          className="flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="name" value="Your name" className="text-white" />
            <TextInput
              id="name"
              {...register("name")}
              type="text"
              placeholder="Enter Your Name"
            />
            {formState.errors.name && formState.touchedFields.name ? (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.name.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <Label htmlFor="email" value="Your email" className="text-white" />
            <TextInput
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter Your email"
            />
            {formState.errors.email && formState.touchedFields.email ? (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.email.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              value="Your password"
              className="text-white"
            />
            <TextInput
              id="password"
              {...register("password")}
              type="password"
              placeholder="Enter Your password"
            />
            {formState.errors.password && formState.touchedFields.password ? (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.password.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <Label
              htmlFor="rePassword"
              value="Re-enter password"
              className="text-white"
            />
            <TextInput
              id="rePassword"
              {...register("rePassword")}
              type="password"
              placeholder="Enter Your password again"
            />
            {formState.errors.rePassword &&
            formState.touchedFields.rePassword ? (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.rePassword.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <Label
              htmlFor="dateOfBirth"
              value="Your date of birth"
              className="text-white"
            />
            <TextInput
              id="dateOfBirth"
              {...register("dateOfBirth")}
              type="date"
              placeholder="Enter Your date of birth"
            />
            {formState.errors.dateOfBirth &&
            formState.touchedFields.dateOfBirth ? (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.dateOfBirth.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <Radio id="male" {...register("gender")} value="male" />
              <Label htmlFor="male" className="text-white">
                Male
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="female" {...register("gender")} value="female" />
              <Label htmlFor="female" className="text-white">
                Female
              </Label>
            </div>

            {/* الرسالة هنا برا الـ div بتاع الراديو */}
            {formState.errors.gender && (
              <p className="text-red-500 text-sm mt-1 ml-1 transition-all">
                {formState.errors.gender.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 cursor-pointer p-2 w-full text-lg font-bold shadow-lg hover:scale-105 transition-transform duration-300 
            bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full"
          >
            {loading ? (
              <i
                className="fa-solid fa-spinner fa-spin fa-1x"
                aria-hidden="true"
              ></i>
            ) : (
              "Submit"
            )}
          </button>
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

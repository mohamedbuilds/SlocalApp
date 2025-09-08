import { Label, TextInput, Card, Radio } from "flowbite-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export function Login() {
  let navigate = useNavigate();
  let { setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const schema = z.object({
    email: z.email("The email address looks invalid. Please try again."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
  });
  let form = useForm({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState } = form;

  async function handelRegister(values) {
    // Call Api
    try {
      setloading(true);
      let response = await axios.post(
        `https://linked-posts.routemisr.com/users/signin`,
        values
      );
      console.log(response);
      if (response.data.message == "success") {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        setuser(response.data.token)
        navigate("/");
      }
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600">
      <Card className="w-full max-w-md bg-gray-900 shadow-xl border-0">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form
          onSubmit={handleSubmit(handelRegister)}
          className="flex flex-col gap-4"
        >
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
              "Login"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}

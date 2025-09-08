import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
export function MyNavbar() {
  let navgiate = useNavigate();
  let { user, setuser } = useContext(UserContext);
  function sinOutUser() {
    localStorage.removeItem("token");
    setuser(null);
    navgiate("/login");
  }

  function getuserprofile() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }
let token = localStorage.getItem("token");
  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getuserprofile,
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  if (isError)
    return (
      <div className="text-center text-red-500 font-medium text-lg mt-10">
        Error: {error.message}
      </div>
    );

  const users = data?.data?.user;
  return (
    <Navbar className="fixed start-0 end-0 z-50 w-full">
      <NavbarBrand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Soical App
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {user !== null ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" img={users.photo} rounded />}
            >
              <DropdownHeader>
                <span className="block text-sm">{users?.name}</span>
                <span className="block truncate text-sm font-medium">
                  {users.email}
                </span>
              </DropdownHeader>
              <DropdownItem as={Link} to="/profile">
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={sinOutUser}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-600"
              >
                Sign out
              </DropdownItem>
            </Dropdown>
          </>
        ) : (
          <>
            <ul className="flex items-center ms-6 gap-6 text-white">
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
              <li>
                <Link to={"/register"}>Register</Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </Navbar>
  );
}

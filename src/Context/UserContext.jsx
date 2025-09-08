import { createContext, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider(props) {
  const [user, setuser] = useState(localStorage.getItem("token"));

  return (
    <>
      <UserContext.Provider value={{ setuser, user }}>
        {props.children}
      </UserContext.Provider>
    </>
  );
}

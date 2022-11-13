// dependencies lib
import { createSignal } from "solid-js";

// type
import { UserInfoFromServer } from "@/interfaces";

export const handleCurrentUser = () => {
  const [currentUser, setCurrentUser] = createSignal<UserInfoFromServer>({
    id: -1,
    user_name: "connecting...",
    email: "",
    permission: 0,
  });
  const [userList, setUserList] = createSignal<string[]>();
  return {
    currentUser,
    setCurrentUser,
    userList,
    setUserList,
  };
};

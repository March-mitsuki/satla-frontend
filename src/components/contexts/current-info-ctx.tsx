// dependencies lib
import { createRoot, createSignal } from "solid-js";

// type
import { UserInfoFromServer } from "@/interfaces";

const handlerCurrentUser = () => {
  const [currentUser, setCurrentUser] = createSignal<UserInfoFromServer>({
    id: -1,
    user_name: "connecting...",
    email: "",
  })
  const [userList, setUserList] = createSignal<string[]>()
  return {
    currentUser, setCurrentUser,
    userList, setUserList,
  }
}

export default createRoot(handlerCurrentUser)

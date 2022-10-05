// dependencies lib
import { createRoot, createSignal } from "solid-js";

// type
import { UserInfoFromServer } from "@/interfaces";

const handlerCurrentUser = () => {
  const [currentUser, setCurrentUser] = createSignal<UserInfoFromServer>({
    id: -1,
    user_name: "connecting...",
    email: ""
  })
  return { currentUser, setCurrentUser }
}

export default createRoot(handlerCurrentUser)

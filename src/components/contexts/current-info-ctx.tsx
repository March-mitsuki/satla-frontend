// dependencies lib
import { createRoot, createSignal } from "solid-js";

// type
import { CurrentInfo } from "@/interfaces";

const handlerCurrentUser = () => {
  const [currentUser, setCurrentUser] = createSignal<CurrentInfo>({
    id: -1,
    current_user_name: "connecting...",
    current_user_email: "",
    user_list: []
  })
  return { currentUser, setCurrentUser }
}

export default createRoot(handlerCurrentUser)

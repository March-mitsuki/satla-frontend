// dependencies lib
import { createEffect, createResource, onCleanup } from "solid-js"

// local dependencies
import _currentUser from "../contexts/current-info-ctx"

// type
import type { CurrentInfo } from "@/interfaces"

const currentUserInfo = () => {
  const fetchCurrentUserInfo = async () => {
    // const url = "http://192.168.64.3:8080/api/crrent_userinfo"
    // const response = await fetch(url)
    // const body: UserInfoFromServer = await response.json()
    const body = await new Promise<CurrentInfo>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          current_user_name: "local_test",
          current_user_email: "test@email",
          id: 1234,
          user_list: []
        })
      }, 2000);
    })
    return body
  }

  const { setCurrentUser } = _currentUser
  const [ cUserInfo ] = createResource<CurrentInfo>(fetchCurrentUserInfo)

  createEffect(() => {
    if (!cUserInfo.loading) {
      setCurrentUser((cUserInfo() as CurrentInfo))
    }
    onCleanup(() => {
      setCurrentUser({
        id: -1,
        current_user_name: "connecting...",
        current_user_email: "",
        user_list: []
      })
    })
  })

  return (
    <div>
      <span>{ cUserInfo.loading && "Loading..." }</span>
      {cUserInfo()?.current_user_name}
    </div>
  )
}

export default currentUserInfo
// dependencies lib
import { createEffect, createResource, onCleanup } from "solid-js"

// local dependencies
import _currentUser from "../contexts/current-user"

// type
import type { UserInfoFromServer } from "@/interfaces"

const currentUserInfo = () => {
  const fetchCurrentUserInfo = async () => {
    // const url = "http://192.168.64.3:8080/api/crrent_userinfo"
    // const response = await fetch(url)
    // const body: UserInfoFromServer = await response.json()
    const body = await new Promise<UserInfoFromServer>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          user_name: "local_test",
          email: "test@email",
          id: 1234,
        })
      }, 2000);
    })
    return body
  }

  const { setCurrentUser } = _currentUser
  const [ cUserInfo ] = createResource<UserInfoFromServer>(fetchCurrentUserInfo)

  createEffect(() => {
    if (!cUserInfo.loading) {
      setCurrentUser((cUserInfo() as UserInfoFromServer))
    }
    onCleanup(() => {
      setCurrentUser({
        id: -1,
        user_name: "connecting...",
        email: ""
      })
    })
  })

  return (
    <div>
      <span>{ cUserInfo.loading && "Loading..." }</span>
      {cUserInfo()?.user_name}
    </div>
  )
}

export default currentUserInfo
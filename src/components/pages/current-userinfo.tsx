// dependencies lib
import { createEffect, createResource, onCleanup } from "solid-js"

// local dependencies
import _currentInfo from "../contexts/current-info-ctx"

// type
import type { UserInfoFromServer } from "@/interfaces"

const currentUserInfo = () => {
  const fetchCurrentUserInfo = async () => {
    let body: UserInfoFromServer;
    if (import.meta.env.PROD) {
      const api_base_url = import.meta.env.VITE_API_BASE_URL
      const url = api_base_url + "api/crrent_userinfo"
      const response = await fetch(url)
      body = await response.json()
    } else {
      body = await new Promise<UserInfoFromServer>((resolve, reject) => {
        const nameList = ["t01", "t02", "t03", "t04", "t05", "t06", "t07", "t08"]
        const randomName = () => {
          return Math.floor(Math.random() * nameList.length)
        }
        setTimeout(() => {
          resolve({
            user_name: nameList[randomName()],
            email: "test@email",
            id: 1234,
            permission: 2,
          })
        }, 1000);
      })
    }
    return body
  }

  const { setCurrentUser } = _currentInfo
  const [ cUserInfo ] = createResource<UserInfoFromServer>(fetchCurrentUserInfo)

  createEffect(() => {
    if (!cUserInfo.loading) {
      setCurrentUser((cUserInfo() as UserInfoFromServer))
    }
    onCleanup(() => {
      setCurrentUser({
        id: -1,
        user_name: "connecting...",
        email: "",
        permission: 0,
      })
    })
  })

  return (
    <div>
      <span>{ cUserInfo.loading &&
        <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
      }</span>
      {cUserInfo()?.user_name}
    </div>
  )
}

export default currentUserInfo
const LogoutBtn = () => {
  const logoutBtnHandler = (
    e: MouseEvent & { currentTarget: HTMLButtonElement }
  ) => {
    e.preventDefault()
    const url = "http://192.168.64.3:8080/api/logout"
    fetch(url, {
      method: "DELETE",
      redirect: "follow",
    }).then(res => {
      if (res.redirected) {
        location.reload()
      } else {
        console.log("未收到正确回复: ", res);
      }
    }).catch(err => {
      console.log("logout error: ", err);
    })
  }

  return (
    <button
      onClick={e => logoutBtnHandler(e)}
      class="flex items-center gap-1 cursor-pointer rounded-md hover:bg-neutral-600 active:bg-neutral-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      退出登录
    </button>
  )
}

export default LogoutBtn

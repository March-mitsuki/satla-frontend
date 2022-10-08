// dependencies lib
import { createSignal } from "solid-js";

// local dependencies
import _currentInfo from "@/components/contexts/current-info-ctx"

// type
import type { NewProjectResponseBody, Project } from "@/interfaces";

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const ProjectForm = () => {
  const { currentUser } = _currentInfo
  const [ isErr, setIsErr ] = createSignal<{
    status: boolean,
    msg: string
  }>({
    status: false,
    msg: ""
  })

  const poster = async (p: Project): Promise<Response> => {
    const url = "http://192.168.64.3:8080/api/new_project"
    const postData = JSON.stringify(p)
    console.log("will post", postData);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData
    })
    return response
  }

  // 定义submit用的复用函数
  const _submitHandler = (
    formElem: HTMLFormElement
  ) => {
    const projectName: string = formElem.projectName.value
    const description: string = formElem.description.value
    const pointMan: string = formElem.pointMan.value
    if (!projectName || !description || !pointMan) {
      setIsErr({
        status: true,
        msg: "请填写所有项目",
      })
      return
    }
    if (description.length > 100) {
      setIsErr({
        status: true,
        msg: "项目描述超过100字",
      })
      return
    }
    const re = new RegExp("^[a-z0-9_]{1,30}$");
    if (!re.test(projectName)) {
      setIsErr({
        status: true,
        msg: "只允许英文小文字加下划线组合",
      })
      return
    }
    if (currentUser().id === -1) {
      setIsErr({
        status: true,
        msg: "登录状态出错,请重新登录后尝试",
      })
      return
    }
    const newProject: Project = {
      id: Date.now(),
      project_name: projectName,
      description: description,
      point_man: pointMan,
      created_by: currentUser().name,
    }
    poster(newProject)
    .then(async res => {
      if (res.status === 200) {
        const body: NewProjectResponseBody = await res.json()
        if (body.code === -1) {
          if (body.status === 5303) {
            setIsErr({
              status: true,
              msg: "创建失败, 可能是项目名称重复, 请更改后重试"
            })
          }
        } else if (body.code === 0) {
          // 如果成功则清空form value
          formElem.projectName.value = ""
          formElem.description.value = ""
          formElem.pointMan.value = ""
          if (isErr()) {
            setIsErr({
              status: false,
              msg: "",
            })
          }
        }
      }
    })
    .catch(err => {
      setIsErr({
        status: true,
        msg: "网络错误: " + err,
      })
    })

    return
  }

  const onSubmitHandler = (
    e: Event & { currentTarget: HTMLFormElement }
  ) => {
    e.preventDefault()
    const formElem = e.currentTarget
    _submitHandler(formElem)
  }

  const textareaKeyDownHandler = (
    e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const formElem = document.getElementById("project-form")
      _submitHandler((formElem as HTMLFormElement))
    }
  }

  return (
    <form
      id="project-form"
      onSubmit={e => onSubmitHandler(e)}
      class="border-2 p-2 flex gap-2 justify-center overflow-auto"
    >
      {isErr().status && 
        <div class="flex flex-col text-red-500 h-20 overflow-hidden">
          <div>
            *{isErr().msg}
          </div>
          <div>
            *若一直失败请联系管理员
          </div>
        </div>
      }
      <label
        class="flex flex-col"
      >
        <div>项目名称</div>
        <input
          type="text"
          name="projectName"
          pattern="^[a-z0-9_]{1,30}$"
          placeholder="请输入"
          class="
            flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm
            focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
            invalid:focus:border-red-500 invalid:border-red-500
          "
        />
        <div class="text-sm">
          *英小文字加下划线,30字以内
        </div>
      </label>
      <label
        class="flex flex-col"
      >
        <div>项目描述</div>
        <textarea
          onKeyDown={e => textareaKeyDownHandler(e)}
          name="description"
          placeholder="请输入"
          autocomplete="off"
          class="rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"
        ></textarea>
        <div class="text-sm">
          *100字以内,不可换行
        </div>
      </label>
      <label
        class="flex flex-col"
      >
        <div>负责人</div>
        <input
          type="text"
          name="pointMan"
          placeholder="请输入"
          class={inputStyle}
        />
        <div class="text-sm">
          *以后会改成下拉框选择
        </div>
      </label>
      <div class="flex flex-col justify-center">
        <button
          type="submit"
          class="bg-orange-500/70 hover:bg-orange-700/70 active:bg-orange-500/70 rounded-full px-3 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 m-[2px]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default ProjectForm

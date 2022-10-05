// type
import type { Project } from "@/interfaces";

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const ProjectForm = () => {
  const poster = async (p: Project): Promise<Response> => {
    const url = "http://192.168.64.3:8080/api/new_project"
    const postData = JSON.stringify(p)
    console.log("will post", p);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData
    })
    return response.json()
  }

  const onSubmitHandler = async (
    e: Event & { currentTarget: HTMLFormElement }
  ) => {
    e.preventDefault()
    const formElem = e.currentTarget
    const projectName: string = formElem.projectName.value
    const description: string = formElem.description.value
    const pointMan: string = formElem.pointMan.value
    if (!projectName || !description || !pointMan) {
      console.log("不能为空");
      return
    }
    if (description.length > 100) {
      console.log("项目描述超过100字");
      return
    }
    const re = new RegExp("^[a-z0-9_]{1,30}$");
    if (!re.test(projectName)) {
      console.log("只允许英文小文字加下划线组合");
      return
    }
    const newProject: Project = {
      id: Date.now(),
      project_name: projectName,
      description: description,
      point_man: pointMan,
      created_by: "默认账户",
    }
    const data = await poster(newProject)
    console.log("post success:", data);
  }

  const textareaKeyDownHandler = async (
    e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const formElem = document.getElementById("project-form")
      const projectName: string = (formElem as HTMLFormElement).projectName.value
      const description: string = (formElem as HTMLFormElement).description.value
      const pointMan: string = (formElem as HTMLFormElement).pointMan.value
      if (!projectName || !description || !pointMan) {
        console.log("不能为空");
        return
      }
      if (description.length > 100) {
        console.log("项目描述超过100字");
        return
      }
      const re = new RegExp("^[a-zA-Z0-9_]{1,30}$");
      if (!re.test(projectName)) {
        console.log("只允许英文小文字数字加下划线组合,且在30字以内");
        return
      }
      const newProject: Project = {
        id: Date.now(),
        project_name: projectName,
        description: description,
        point_man: pointMan,
        created_by: "默认账户",
      }
      const response = await poster(newProject)
      console.log("post success:", response);
    }
  }

  return (
    <form
      id="project-form"
      onSubmit={e => onSubmitHandler(e)}
      class="border-2 p-2 flex gap-2 justify-center overflow-auto"
    >
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

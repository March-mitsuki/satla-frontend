// dependencies lib
import { For } from "solid-js"
import { Link } from "@solidjs/router"

// type
import type { Component } from "solid-js"
import type { Project } from "@/interfaces"

const ProjectOverview: Component<{
  projects: Project[] | undefined
}> = (props) => {
  return (
    <div class="flex flex-col gap-2 border-2 p-2">
      <div class="col-span-full grid grid-cols-7 gap-2 justify-between">
        <div class="text-center truncate">ID</div>
        <div class="text-center truncate col-span-2">项目名称</div>
        <div class="text-center truncate">项目描述</div>
        <div class="text-center truncate col-span-3">操作</div>
      </div>
      <For each={props.projects}>{(elem, idx) => 
        <div class="col-span-full grid grid-cols-7 gap-2">
          <div class="text-center truncate">{elem.id}</div>
          <div class="text-center truncate col-span-2">{elem.project_name}</div>
          <div class="text-center truncate">{elem.description}</div>
          <div class="text-center">
            <Link
              href={`/translate/${elem.project_name}`}
              class="bg-green-500/60 rounded-md text-center text-sm truncate px-1 py-[2px] hover:bg-green-600/60"
            >同传页面</Link>
          </div>
          <div class="text-center">
            <Link
              href={`/send/${elem.project_name}`}
              class="bg-orange-500/60 rounded-md text-center text-sm truncate px-1 py-[2px] hover:bg-orange-600/60"
            >发送页面</Link>
          </div>
          <div class="text-center">
            <button
              onClick={() => console.log("查看详情 ->", elem.project_name)}
              class="bg-neutral-500/60 rounded-md text-center text-sm truncate px-1 hover:bg-neutral-600/60"
            >
              查看详情
            </button>
          </div>
        </div>
      }</For>
    </div>  
  )
}

export default ProjectOverview

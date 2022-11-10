// dependencies lib
import { For, Switch, Match, onCleanup } from "solid-js";

// local depandencies
import rootCtx from "../contexts";

// type
import type { Component } from "solid-js";
import type { Project } from "@/interfaces";

const ProjectOverview: Component<{
  projects: Project[] | undefined;
  type: "admin" | "nomal";
}> = (props) => {
  const { setCurrentProject } = rootCtx.currentProjectCtx;

  onCleanup(() => {
    setCurrentProject({
      id: -1,
      project_name: "尚未选择",
      description: "尚未选择",
      point_man: "尚未选择",
      created_by: "尚未选择",
    });
  });

  return (
    <div class="flex flex-col gap-2 border-2 p-2">
      <div class="col-span-full grid grid-cols-6 gap-2 justify-between border-b-2 pb-2 border-neutral-400">
        <div class="text-center truncate">ID</div>
        <div class="text-center truncate">项目名称</div>
        <div class="text-center truncate col-span-2">项目描述</div>
        <div class="text-center truncate">负责人</div>
        <div class="text-center truncate">操作</div>
      </div>
      <For each={props.projects}>
        {(elem) => (
          <div class="col-span-full grid grid-cols-6 gap-2">
            <div class="text-center truncate">{elem.id}</div>
            <div class="text-center truncate">{elem.project_name}</div>
            <div class="text-center truncate col-span-2">{elem.description}</div>
            <div class="text-center truncate">{elem.point_man}</div>
            <div class="text-center">
              <button
                onClick={() => {
                  setCurrentProject(elem);
                  console.log("set project");
                }}
                classList={{
                  "bg-green-500/60 rounded-md text-center text-sm truncate px-1 hover:bg-green-600/60":
                    props.type === "nomal",
                  "bg-orange-500/60 rounded-md text-center text-sm truncate px-1 hover:bg-orange-600/60":
                    props.type === "admin",
                }}
              >
                <Switch>
                  <Match when={props.type === "nomal"}>
                    <span>查看详情</span>
                  </Match>
                  <Match when={props.type === "admin"}>
                    <span>设为当前</span>
                  </Match>
                </Switch>
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default ProjectOverview;

// dependencies lib
import { Component, createResource, For, Switch, Match } from "solid-js";
import { Link } from "@solidjs/router";

import type { RoomData, ErrJsonRes, Project } from "@/interfaces";
import { isErrJsonRes } from "../tools";
import rootCtx from "../contexts";

const ProjectDetailOverview: Component = () => {
  const { currentProject } = rootCtx.currentProjectCtx;
  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  const fetchDetail = async (project: Project): Promise<RoomData[]> => {
    const url = api_base_url + `api/project_detail/${project.id}`;
    const response = await fetch(url);
    const body = (await response.json()) as RoomData[] | ErrJsonRes;
    if (isErrJsonRes(body)) {
      return [
        {
          id: -1,
          room_name: "not found",
          room_type: -1,
          description: `err: ${body.status} -> ${body.msg}`,
        },
      ];
    }
    if (body.length === 0) {
      return [
        {
          id: -1,
          room_name: "nothing here",
          room_type: -1,
          description: "当前项目内无任何房间",
        },
      ];
    }
    return body;
  };
  const [detail] = createResource(currentProject, fetchDetail);

  return (
    <div class="p-2">
      <div class="flex flex-col gap-2 border-2 p-2">
        {detail.loading && (
          <div class="flex">
            <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
            Loading...
          </div>
        )}
        <div class="col-span-full grid grid-cols-5 gap-2 justify-between border-b-2 pb-2 border-neutral-400">
          <div class="text-center truncate">房间名称</div>
          <div class="text-center truncate">房间类型</div>
          <div class="text-center truncate">备注</div>
          <div class="text-center truncate col-span-2">操作</div>
        </div>
        <For each={detail()}>
          {(elem) => (
            <Switch>
              <Match when={elem.room_type === 1}>
                <div class="col-span-full grid grid-cols-5 gap-2">
                  <div class="text-center truncate">{elem.room_name}</div>
                  <div class="text-center truncate">同传</div>
                  <div class="text-center truncate">{elem.description}</div>
                  <div class="text-center">
                    <Link
                      href={`/translate/${elem.room_name}`}
                      class="bg-green-500/60 rounded-md text-center text-sm truncate px-1 py-[2px] hover:bg-green-600/60"
                    >
                      同传页面
                    </Link>
                  </div>
                  <div class="text-center">
                    <Link
                      href={`/send/${elem.room_name}`}
                      class="bg-orange-500/60 rounded-md text-center text-sm truncate px-1 py-[2px] hover:bg-orange-600/60"
                    >
                      发送页面
                    </Link>
                  </div>
                </div>
              </Match>
              <Match when={elem.room_type === 2}>
                <div class="col-span-full grid grid-cols-5 gap-2">
                  <div class="text-center truncate">{elem.room_name}</div>
                  <div class="text-center truncate">自动发送</div>
                  <div class="text-center truncate">{elem.description}</div>
                  <div class="text-center col-span-2">
                    <Link
                      href={`/`}
                      class="bg-sky-500/60 rounded-md text-center text-sm truncate px-1 py-[2px] hover:bg-sky-600/60"
                    >
                      操作页面
                    </Link>
                  </div>
                </div>
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  );
};

export default ProjectDetailOverview;

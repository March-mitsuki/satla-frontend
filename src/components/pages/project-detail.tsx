// dependencies lib
import { Component, createResource, For } from "solid-js";

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
          room_id: -1,
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
          room_id: -1,
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
    <div>
      {detail.loading && <div>Loading...</div>}
      <For each={detail()}>
        {(elem) => (
          <div>
            <div>{elem.room_id}</div>
            <div>{elem.room_name}</div>
            <div>{elem.room_type}</div>
            <div>{elem.description}</div>
          </div>
        )}
      </For>
    </div>
  );
};

export default ProjectDetailOverview;

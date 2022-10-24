// dependencies lib
import { Title } from "@solidjs/meta";
import { createResource } from "solid-js"

// local dependencies
import { PaneX } from "@/components";
import { ProjectOverview, IndexNavi } from "@/components/pages"
import _currentInfo from "@/components/contexts/current-info-ctx"

// type
import type { Component } from "solid-js";
import type { Project } from "@/interfaces";


const Home: Component = () => {
  const api_base_url = import.meta.env.VITE_API_BASE_URL

  const fetchAllProjects = async () => {
    const url = api_base_url + "api/all_projects"
    const response = await fetch(url)
    const body: Project[] = await response.json()
    console.log("get all projects respons body: ", body);
    return body
  }
  const [ projects, { refetch } ] = createResource<Project[]>(fetchAllProjects)

  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="flex justify-between items-center shadow-lg text-xl py-3 px-5">
          <IndexNavi></IndexNavi>
        </div>
        <div class="flex-auto">
          <PaneX
            minLeftElem="35%"
            minRightElem="20%"
            leftElem={
              <div class="p-2">
                <div class="flex justify-end gap-5 p-2 border-x-2 border-t-2">
                  {projects.loading &&
                    <div class="flex gap-2 items-center">
                      <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      <div>connecting...</div>
                    </div>
                  }
                  <button
                    onClick={refetch}
                    class="flex justify-center items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <div>
                      刷新项目列表
                    </div>
                  </button>
                </div>
                <ProjectOverview projects={projects()}></ProjectOverview>
              </div>
            }
            rightElem={
              <div class="p-2">
                Details Here
              </div>
            }
            dragLineClass="bg-neutral-500 hover:bg-sky-500"
          ></PaneX>
        </div>
      </div>
    </>
  );
};

export default Home;

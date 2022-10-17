// dependencies lib
import { Title } from "@solidjs/meta";
import { createResource } from "solid-js"

// local dependencies
import { PaneX } from "@/components";
import {
  ProjectOverview,
  LogoutBtn,
  CurrentUserInfo,
} from "@/components/pages"
import _currentInfo from "@/components/contexts/current-info-ctx"

// type
import type { Component } from "solid-js";
import type { Project } from "@/interfaces";
import { Link } from "@solidjs/router";


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
          <div class="flex gap-5 justify-center items-center">
            <div>
              Welcome to vvvorld
            </div>
            {_currentInfo.currentUser().permission === 2 &&
              <>
                <div class="h-6 w-[2px] bg-gray-400 rounded-full"></div>
                <Link href="/admin" class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  后台页面
                </Link>
              </>
            }
          </div>
          <div class="flex justify-center items-center gap-5">
            <CurrentUserInfo></CurrentUserInfo>
            <div class="h-6 w-[2px] bg-gray-400 rounded-full"></div>
            <LogoutBtn></LogoutBtn>
          </div>
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

// dependencies lib
import { Title } from "@solidjs/meta";
import { createResource, createSignal, onMount } from "solid-js"

// local dependencies
import { PaneX } from "@/components";
import {
  ProjectOverview,
  ProjectForm,
  LogoutBtn,
  CurrentUserInfo,
} from "@/components/pages"

// type
import type { Component } from "solid-js";
import type { ProjectFromServer } from "@/interfaces";


const Home: Component = () => {
  // const [ projects, setProjects ] = createSignal<Project[]>(dummyProject)
  const fetchAllProjects = async () => {
    const url = "http://192.168.64.3:8080/api/all_projects"
    const response = await fetch(url)
    const body: ProjectFromServer[] = await response.json()
    console.log("get all projects respons body: ", body);
    return body
  }
  const [ projects ] = createResource<ProjectFromServer[]>(fetchAllProjects)

  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="flex justify-between items-center shadow-lg text-xl py-3 px-5">
          <div>
            Welcome to vvvorld
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
                {projects.loading && <span>connecting to server...</span>}
                <ProjectOverview projects={projects()}></ProjectOverview>
              </div>
            }
            rightElem={
              <div class="p-2">
                <ProjectForm></ProjectForm>
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

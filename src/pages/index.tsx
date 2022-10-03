import { Title } from "@solidjs/meta";

import { PaneX } from "@/components";
import { ProjectOverview, ProjectForm } from "@/components/pages"

import type { Component } from "solid-js";

import dummyProject from "@/assets/dummy-project";
import { Link } from "@solidjs/router";


const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="flex justify-end shadow-lg text-xl py-3 px-5">
          {/* <Link
            href="/login"
            class="flex justify-center items-center px-2 py-1 rounded-md hover:bg-neutral-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 rotate-180">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            登录
          </Link> */}
          <div>
            <Link href="/api/logout" class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              退出登录
            </Link>
          </div>
        </div>
        <div class="flex-auto">
          <PaneX
            minLeftElem="35%"
            minRightElem="20%"
            leftElem={
              <div class="p-2">
                <ProjectOverview projects={dummyProject}></ProjectOverview>
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

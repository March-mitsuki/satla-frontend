// dependencies lib
import { Title } from "@solidjs/meta";
// local dependencies
import { PaneX } from "@/components";
import {
  ProjectOverview,
  ProjectForm,
  LogoutBtn,
  WsUsers,
} from "@/components/pages"
// type
import type { Component } from "solid-js";
// for temporary test
import dummyProject from "@/assets/dummy-project";


const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="flex justify-between items-center shadow-lg text-xl py-3 px-5">
          <div>
            Welcome to vvvorld
          </div>
          <div class="flex justify-center items-center gap-5">
            <WsUsers></WsUsers>
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

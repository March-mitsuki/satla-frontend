import { Title } from "@solidjs/meta";

import { PaneX } from "@/components";
import { ProjectOverview, ProjectForm } from "@/components/pages"

import type { Component } from "solid-js";

import dummyProject from "@/assets/dummy-project";


const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        {/* <div class="shadow-lg text-xl py-3 px-5">
          <Navi></Navi>
        </div> */}
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

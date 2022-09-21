import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { Link } from "@solidjs/router";

import { PaneX } from "@/components";

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
            minRightElem="30%"
            leftElem={
              <div class="p-2">
                <div class="flex flex-col gap-2 border-2 p-2">
                  <div class="col-span-full grid grid-cols-6 gap-2 justify-between">
                    <div class="text-center">ID</div>
                    <div class="text-center">项目名称</div>
                    <div class="text-center">项目描述</div>
                    <div class="text-center col-span-3">操作</div>
                  </div>
                  <For each={dummyProject}>{(elem, idx) => 
                    <div class="col-span-full grid grid-cols-6 gap-2">
                      <div class="text-center truncate">{elem.id}</div>
                      <div class="text-center truncate">{elem.project_name}</div>
                      <div class="text-center truncate">{elem.description}</div>
                      <div class="text-center">
                        <Link
                          href={`/translate/${elem.project_name}`}
                          class="bg-neutral-500 rounded-md text-center truncate px-1 py-[3px] hover:bg-neutral-600"
                        >同传页面</Link>
                      </div>
                      <div class="text-center">
                        <Link
                          href={`/send/${elem.project_name}`}
                          class="bg-neutral-500 rounded-md text-center truncate px-1 py-[3px] hover:bg-neutral-600"
                        >发送页面</Link>
                      </div>
                      <div class="text-center">
                        <button
                          onClick={() => console.log("查看详情 ->", elem.project_name)}
                          class="bg-neutral-500 rounded-md text-center truncate px-1 hover:bg-neutral-600"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  }</For>
                </div>
              </div>
            }
            rightElem={
              <div>
                Details will be here
              </div>
            }
            dragLineClass="bg-neutral-500"
          ></PaneX>
        </div>
      </div>
    </>
  );
};

export default Home;

// dependencies lib
import { Title } from "@solidjs/meta";
import { createResource } from "solid-js";

// local dependencies
import { AdminNavi, NewRoomForm } from "@/components/pages/admin";
import { ProjectDetail, ProjectOverview } from "@/components/pages";
import { PaneX, PaneY } from "@/components";

// type
import { Project } from "@/interfaces";

const AdminHome = () => {
  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  const fetchAllProjects = async () => {
    const url = api_base_url + "api/all_projects";
    const response = await fetch(url);
    const body = (await response.json()) as Project[];
    console.log("get all projects respons body: ", body);
    return body;
  };
  const [projects, { refetch }] = createResource<Project[]>(fetchAllProjects);

  return (
    <>
      <Title>Admin Page</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <AdminNavi />
        </div>
        <div class="flex-auto">
          <PaneX
            minLeftElem="35%"
            minRightElem="35%"
            leftElem={
              <PaneY
                headHeight={60}
                minTopELem="30%"
                minBottomElem="30%"
                topElem={
                  <div class="p-2">
                    <div class="flex justify-end gap-5 p-2 border-x-2 border-t-2">
                      {projects.loading && (
                        <div class="flex gap-2 items-center">
                          <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                          <div>connecting...</div>
                        </div>
                      )}
                      <button onClick={() => refetch} class="flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                        <div>刷新项目列表</div>
                      </button>
                    </div>
                    <ProjectOverview type="admin" projects={projects()} />
                  </div>
                }
                bottomElem={<ProjectDetail />}
                dragLineClass="bg-neutral-500 hover:bg-sky-500"
               />
            }
            rightElem={
              <div class="h-full flex items-center ">
                <NewRoomForm />
              </div>
            }
            dragLineClass="bg-neutral-500 hover:bg-sky-500"
           />
        </div>
      </div>
    </>
  );
};

export default AdminHome;

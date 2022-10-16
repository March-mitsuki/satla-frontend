// dependencies lib
import { Title } from "@solidjs/meta"

// local dependencies
import { AdminNavi } from "@/components/pages/admin"
import { ProjectForm } from "@/components/pages"

const AdminNewProject = () => {
  return (
    <>
      <Title>New Project</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <AdminNavi></AdminNavi>
        </div>
        <div>
          <ProjectForm></ProjectForm>
        </div>
      </div>
    </>
  )
}

export default AdminNewProject

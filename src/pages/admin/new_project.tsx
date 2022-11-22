// dependencies lib
import { Title } from "@solidjs/meta";

// local dependencies
import { AdminNavi, NewProjectForm } from "@/components/pages/admin";

const AdminNewProject = () => {
  return (
    <>
      <Title>New Project</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <AdminNavi />
        </div>
        <NewProjectForm />
      </div>
    </>
  );
};

export default AdminNewProject;

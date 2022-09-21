import type { Project } from "@/interfaces";

const Projects: Project[] = [
  {
    id: 1,
    project_name: "default",
    description: "默认项目",
    point_man: "三月",
    created_by: "三月",
    created_time: Date.now(),
    is_delete: false,
  },
  {
    id: 2,
    project_name: "test",
    description: "测试项目",
    point_man: "四月",
    created_by: "三月",
    created_time: Date.now(),
    is_delete: false,
  },
  {
    id: 3,
    project_name: "mitsuki_test",
    description: "第二个测试项目",
    point_man: "みつき",
    created_by: "mitsuki",
    created_time: Date.now(),
    is_delete: false,
  },
]

export default Projects

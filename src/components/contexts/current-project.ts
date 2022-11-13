import { createSignal } from "solid-js";

import type { Project } from "@/interfaces";

export const handleCurrentProject = () => {
  const [currentProject, setCurrentProject] = createSignal<Project>();
  return { currentProject, setCurrentProject };
};

import { Project } from "."

// admin检测基于cookie中的email行进行检测

export interface SignupUser {
  user_name: string
  email: string
  password: string
  permission: 0 | 1 | 2
}

export type PostCreateProject = Project

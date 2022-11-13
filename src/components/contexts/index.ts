import { createRoot } from "solid-js";

import { handleCurrentUser } from "./current-userinfo";
import { handlePageType } from "./page-type";
import { handleSubtitles } from "./subtitles";
import { handleCurrentProject } from "./current-project";
import { handleAutoplay } from "./autoplay";

const currentUserCtx = handleCurrentUser();
const pageTypeCtx = handlePageType();
const subtitlesCtx = handleSubtitles();
const currentProjectCtx = handleCurrentProject();
const autoplayCtx = handleAutoplay();

const rootCtx = createRoot(() => {
  return { currentUserCtx, pageTypeCtx, subtitlesCtx, currentProjectCtx, autoplayCtx };
});

export default rootCtx;

// dependencies lib
import { Match, Switch, createSignal } from "solid-js";

// local dependencies
import rootCtx from "@/components/contexts";
import { NewRoomResponseBody, Project } from "@/interfaces";

// type
import type { RoomData } from "@/interfaces";

const inputStyle =
  "rounded-lg bg-neutral-700 py-2 px-5 border-2 border-gray-500 focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const newRoomForm = () => {
  const { currentProject } = rootCtx.currentProjectCtx;
  const [postStatus, setPostStatus] = createSignal<{
    status: 0 | 1 | 2; // 1 -> 失败, 2 -> 成功, 默认为0
    msg: string;
  }>({
    status: 0,
    msg: "",
  });

  const poster = async (p: RoomData) => {
    const api_base_url = import.meta.env.VITE_API_BASE_URL;

    const url = api_base_url + "api/admin/new_room";
    console.log("will post", p);
    const postData = new TextEncoder().encode(JSON.stringify(p));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
    });
    return response;
  };

  const handleFromSubmit = (e: Event & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const formElem = e.currentTarget;
    const project = currentProject();
    const roomTypeNum = Number(formElem.roomType.value as string);
    const roomName = formElem.roomName.value as string;
    const description = formElem.description.value as string;
    if (description.length > 100) {
      window.alert("备注大于100字");
      return;
    }
    if (!project) {
      window.alert("项目为undefined");
      return;
    }
    if (project.id <= 0) {
      window.alert("未选择项目");
      return;
    }
    if (isNaN(roomTypeNum)) {
      window.alert("房间类型不正确");
      return;
    }
    const postData: RoomData = {
      id: 0,
      project_id: project.id,
      room_type: roomTypeNum,
      room_name: roomName,
      description: description,
    };
    console.log("submit now:", postData);

    poster(postData)
      .then(async (res) => {
        if (res.status === 200) {
          const body = (await res.json()) as NewRoomResponseBody;
          if (body.code === -1) {
            setPostStatus({
              status: 1,
              msg: `[${body.status}]${body.msg}`,
            });
          } else if (body.code === 0) {
            formElem.roomName.value = "";
            formElem.roomType.value = "1";
            formElem.description.value = "";
            setPostStatus({
              status: 2,
              msg: "创建成功, 现在可以刷新查看新房间",
            });
          }
        } else {
          window.alert("未曾设想的response, 请查看log");
          console.log("[err] unexpected response: ", res);
        }
      })
      .catch((err) => {
        setPostStatus({
          status: 1,
          msg: `网络错误: ${JSON.stringify(err)}`,
        });
      });
  };

  const preventEnterSubmit = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div class="flex-auto flex flex-col justify-center items-center">
      <div class="text-center text-4xl mb-8">新建房间</div>
      <form
        onSubmit={(e) => handleFromSubmit(e)}
        class="p-2 flex flex-col gap-5 justify-center overflow-auto w-[50%]"
      >
        <div>
          <div
            classList={{
              "text-red-500 text-end": postStatus().status === 1,
              "text-green-500 text-end": postStatus().status === 2,
            }}
          >
            {postStatus().msg}
          </div>
          <div>当前项目</div>
          <Switch
            fallback={
              <div class="text-red-500 text-xl font-semibold border-2 border-gray-500 rounded-lg text-center py-1">
                尚未选择
              </div>
            }
          >
            <Match when={typeof currentProject() !== "undefined"}>
              <div
                classList={{
                  "text-red-500 text-xl font-semibold border-2 border-gray-500 rounded-lg text-center py-1":
                    (currentProject() as Project).id <= 0,
                  "text-green-500 text-xl font-semibold border-2 border-gray-500 rounded-lg text-center py-1":
                    (currentProject() as Project).id > 0,
                }}
              >
                {currentProject()?.project_name}
              </div>
            </Match>
          </Switch>
        </div>

        <label class="flex flex-col ">
          <div>房间类型</div>
          <select
            class={
              "bg-neutral-700 rounded-lg py-2 px-5 border-2 border-gray-500 text-center " +
              "focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600 "
            }
            name="roomType"
          >
            <option value="1" selected={true}>
              普通同传
            </option>
            <option value="2">自动发送</option>
          </select>
        </label>

        <label class="flex flex-col ">
          <div>房间名称</div>
          <input
            type="text"
            name="roomName"
            pattern="^[a-z0-9_]{1,30}$"
            onKeyDown={preventEnterSubmit}
            placeholder="小写英数字加下划线,30字以内"
            class="
                rounded-lg bg-neutral-700 py-2 px-5 border-2 border-gray-500
                focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                invalid:focus:border-red-500 invalid:border-red-500
              "
          />
        </label>

        <label class="flex flex-col ">
          <div>备注</div>
          <input
            type="text"
            name="description"
            placeholder="100字以内"
            autocomplete="off"
            class={inputStyle}
            onKeyDown={preventEnterSubmit}
          />
        </label>

        <div class="text-end text-sm">*只能由管理员创建房间</div>
        <button
          type="submit"
          class="flex items-center justify-center bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg p-2 text-white"
        >
          提交
        </button>
      </form>
    </div>
  );
};

export default newRoomForm;

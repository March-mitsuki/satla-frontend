import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';

import { PaneX } from '@/components';

const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col">
        <div class="bg-sky-100">Tool Bar</div>
        <PaneX
          leftElem={
            <div>
              Project here
            </div>
          }
          rightElem={
            <div>
              Details here
            </div>
          }
        ></PaneX>
      </div>
    </>
  );
};

export default Home;

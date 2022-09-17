import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';

import { PaneX } from '@/components';
import { Navi } from '@/components/pages';

const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg text-xl py-3 px-5">
          <Navi></Navi>
        </div>
        <div class='flex-auto'>
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
            dragLineClass="bg-neutral-500"
          ></PaneX>
        </div>
      </div>
    </>
  );
};

export default Home;

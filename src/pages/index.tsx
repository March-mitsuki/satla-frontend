import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';

const Home: Component = () => {
  return (
    <>
      <Title>Vvvorld</Title>
      <div class="h-full flex flex-col">
        <div class="bg-sky-100">Tool Bar</div>
        <div class="flex flex-auto">
          <div class="flex flex-col">
            <div>Someting here</div>
          </div>
          <div class="bg-neutral-300 w-full">
            Subtitles Here
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

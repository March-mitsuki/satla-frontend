import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';
import { PaneX, PaneY } from '../components';

const Somepage: Component = () => {
  return (
    <>
      <Title>Project Page</Title>
      <PaneY
        topElem={
          <PaneX
            leftElem={
              <div class="grid grid-cols-1 h-full overflow-hidden">
                <div class="grid justify-center items-center">
                  <span class="text-8xl">left text</span>
                </div>
              </div>
            }
            rightElem={
              <div class="grid grid-cols-1 h-full">
                <div class="grid justify-center items-center">
                  <span class="text-8xl">right text</span>
                </div>
              </div>
            }
            minRightElem = "10%"
          ></PaneX>
        }
        bottomElem={
          <div class="grid grid-cols-1 h-full overflow-hidden">
            <div class="grid justify-center items-center">
              <span class="text-8xl">bottom text</span>
            </div>
          </div>
        }
        minTopELem = "20%"
      ></PaneY>
    </>
  );
};

export default Somepage;

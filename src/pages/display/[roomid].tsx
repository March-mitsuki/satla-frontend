import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';

const DisplayPage: Component = () => {
  return (
    <>
      <Title>Display Page</Title>
      <div>
        <div>
          翻译
        </div>
        <div>
          原文
        </div>
      </div>
    </>
  );
};

export default DisplayPage;

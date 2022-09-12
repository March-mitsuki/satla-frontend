import type { Component } from 'solid-js';
import { Title } from '@solidjs/meta';

const Home: Component = () => {
  return (
    <>
      <Title>vvvorld</Title>
      <div class='text-4xl'>
        Home Page HERE!
      </div>
      <a href="somepage">Go somepage</a>
    </>
  );
};

export default Home;

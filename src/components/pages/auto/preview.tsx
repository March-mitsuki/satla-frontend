const AutoPreview = () => {
  return (
    <div class="grid grid-cols-4 w-full gap-5 px-20 py-5 ">
      <div class="flex flex-col justify-center items-center bg-neutral-500 rounded-lg mx-10 my-5 py-2 ">
        <div>behind origin</div>
        <div>bihind subtitle</div>
      </div>
      <div class="col-span-2 flex flex-col justify-center items-center bg-blue-400/70 rounded-lg text-xl font-bold ">
        <div>now origin</div>
        <div>now subtitle</div>
      </div>
      <div class="flex flex-col justify-center items-center bg-neutral-500 rounded-lg mx-10 my-5 py-2 ">
        <div>next origin</div>
        <div>next subtitle</div>
      </div>
    </div>
  );
};

export default AutoPreview;

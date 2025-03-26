import { InputForm } from './InputForm';

export const Modal = () => {

  return (
    <dialog open id='dialog' className='absolute mx-auto mt-[15rem] rounded-[10px] p-16'>
      <h1 className='text-4xl mb-5'>Weather</h1>
      <h3 className='text-2xl mb-6'>Ведите город, чтобы узнать погоду</h3>
      <InputForm />
    </dialog>
  );
};

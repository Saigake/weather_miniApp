import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCity } from '../store/weatherSlice';
import { ReactSVG } from 'react-svg';
import loupe from '../icons/loupe.svg';

export const InputForm = () => {
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const query = formData.get('query').trim().toLowerCase();
    if (query.length === 0) {
      toast.error('Пожалуйста, введите город');
      return;
    }
    dispatch(setCity(query));
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-95">
      <input
        className="h-[30px] w-full bg-white/30 border border-borderLight dark:border-borderDark rounded-2xl px-3.5 py-1.5 pr-10 placeholder:text-gray-500 dark:placeholder:text-gray-300
        hover:border-amber-50 transition-colors duration-500 ease-in-out"
        placeholder="Город"
        name="query"
      />
      <ReactSVG
        src={loupe}
        className="theme-icon-path absolute right-3 top-1/2 transform -translate-y-1/2"
      />
    </form>
  );
};

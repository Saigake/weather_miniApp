import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from './components/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { Quantum } from 'ldrs/react';
import { fetchWeather, clearWeather } from './store/weatherSlice';
import { InputForm } from './components/InputForm';
import { toggleTheme } from './store/themeSlice';
import MovingCircles from './components/MovingCircles';
import { ReactSVG } from 'react-svg';
import theme_toggle from './icons/theme_toggle.svg';
import wind from './icons/wind.svg';
import humidity from './icons/humidity.svg';
import uv from './icons/uv.svg';
import vis from './icons/vis.svg';
import pressure from './icons/pressure.svg';
import { ForecastCards } from './components/ForecastCards';
import { AstroCard } from './components/AstroCard';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { weatherData, city, loading, error } = useSelector(
    (state) => state.weather
  );
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    if (!weatherData) {
      document.documentElement.classList.add('modal-active');
    } else {
      document.documentElement.classList.remove('modal-active');
    }
  }, [weatherData]);

  useEffect(() => {
    if (city) {
      dispatch(fetchWeather(city));
    }
  }, [city, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearWeather());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  function WidgetCart({ icon, text, value, unit }) {
    return (
      <div className="Card h-[100px] w-[180px] rounded-[10px] pt-2.5 px-7 pb-5 grid grid-cols-2 grid-rows-3 bg-linear-to-b from-lightFrom to-lightTo">
        <p className="col-span-2 text-center text-sm">{text}</p>
        <ReactSVG
          className="row-span-2 self-center justify-items-center  theme-icon-path"
          src={icon}
        />
        <h3 className="text-2xl">{value}</h3>
        <h3 className="text-sm">{unit}</h3>
      </div>
    );
  }

  return (
    <>
      {!weatherData ? (
        <Modal />
      ) : (
        <>
          <div className="max-w-[980px] mx-auto pt-[15px] font-[Roboto]">
            <header className="flex justify-between items-center mb-15 ">
              <h1 className=" text-4xl content-baseline font-normal">
                Weather
              </h1>
              <InputForm />
              <div
                className="w-8 h-8 flex items-center justify-center border rounded-full border-white/30 bg-white/30 cursor-pointer "
                onClick={() => dispatch(toggleTheme())}
              >
                <ReactSVG className="theme-icon-path" src={theme_toggle} />
              </div>
            </header>
            {loading ? (
              <div className="flex justify-center mt-[40vh] mb-[50vh] ">
                <Quantum size="90" speed="1.75" color="grey" />
              </div>
            ) : (
              <div className="flex flex-col relative">
                <div>
                  <MovingCircles />
                  <div className="justify-items-end text-xl mb-[180px] ">
                    <p>
                      {weatherData.name}, {weatherData.country}
                    </p>
                    <p>
                      {(() => {
                        const weekday = new Date().toLocaleString('ru-RU', {
                          weekday: 'long',
                        });
                        return (
                          weekday.charAt(0).toUpperCase() + weekday.slice(1)
                        );
                      })()}
                    </p>
                    <p className="text-4xl font-black">
                      {new Date().getDate()}.
                      {new Date().toLocaleString('ru-Ru', { month: '2-digit' })}
                    </p>
                  </div>
                  <div className="z-10 grid gap-x-10 gap-y-2 grid-cols-[250px_400px] mb-[50px]">
                    <p className="text-9xl font-black row-span-3 text-end">
                      {Math.round(weatherData.temp_c)}°
                    </p>
                    <p className="text-4xl">
                      {weatherData.text}
                    </p>
                    <p className="text-sm">
                      Ощущается как {Math.round(weatherData.feelslike_c)}°
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 mb-[60px]">
                  <WidgetCart
                    icon={wind}
                    text="Ветер"
                    value={(weatherData.wind_kph / 3.6).toFixed(1)}
                    unit="м/с"
                  />
                  <WidgetCart
                    icon={humidity}
                    text="Влажность"
                    value={weatherData.humidity}
                    unit="%"
                  />
                  <WidgetCart
                    icon={uv}
                    text="УФ"
                    value={Math.round(weatherData.uv)}
                    unit=""
                  />
                  <WidgetCart
                    icon={vis}
                    text="Видимость"
                    value={weatherData.vis_km}
                    unit="км"
                  />
                  <WidgetCart
                    icon={pressure}
                    text="Давление"
                    value={Math.round(weatherData.pressure_mb * 0.75)}
                    unit="мм.рт.ст"
                  />
                </div>
                <div className="flex mb-[60px] gap-5">
                  <AstroCard />
                  <ForecastCards />
                </div>
              </div>
            )}
          </div>
          <footer className="h-[100px] w-[100vw] bg-white/20 relative">
            <p className="absolute left-1/12 top-5">
              Проект был выполнен в целях обучения и практики
            </p>
            <p className="absolute left-1/12 top-15">
              При поддержке{' '}
              <a
                className="text-blue-400 underline hover:text-blue-600 transition-colors duration-500 ease-in-out"
                href="https://www.weatherapi.com/"
                title="Free Weather API"
              >
                WeatherAPI.com
              </a>
            </p>
            <div className="absolute flex right-1/12 gap-x-5 top-5">
              <a href="mailto:Alexandr.Fedorov00@gmail.com">
                <img src="src\icons\email.png" alt="Email" />
              </a>
              <a href="https://github.com/Saigake">
                <img src="src\icons\gitHub.png" alt="GitHub" />
              </a>
              <a href="https://t.me/Leefrute">
                <img src="src\icons\telegram.png" alt="Telegram" />
              </a>
              <a href="https://wa.me/+79276886210">
                <img src="src\icons\whatsapp.png" alt="WhatsApp" />
              </a>
            </div>
          </footer>
          <Toaster position="bottom-center" reverseOrder={false} />
        </>
      )}
    </>
  );
}

export default App;

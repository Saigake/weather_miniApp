import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import cloudBackGround from './assets/cloudBackGround.mp4';
import uvIcon from './assets/uv.png';
import feelsLikeIcon from './assets/feelslike.png';
import humidityIcon from './assets/humidity.png';
import windIcon from './assets/wind.png';
import pressureIcon from './assets/pressure.png';
import visIcon from './assets/vis.png';

import './App.css';

import 'ldrs/lineSpinner';

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(() => {
    const city = localStorage.getItem('city');
    return city ?? null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (city) fetchData(city);
  }, [city]);

  //Функция для запроса и получения информации о погоде
  async function fetchData(query) {
    setIsLoading(true);
    try {
      console.log('Запрос к API с query:', query);
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&q=${query}&days=5&aqi=no&alerts=no&lang=ru`
      );
      console.log('Ответ от API:', response.data);
      const {
        location: { name, country },
        current: {
          condition: { text, icon },
          temp_c,
          uv,
          feelslike_c,
          humidity,
          wind_kph,
          pressure_mb,
          vis_km,
        },
        forecast: { forecastday },
      } = response.data;
      setWeather({
        name, //название города
        country, //название страны
        text, //словесное описание погоды
        icon, //иконка погоды
        temp_c, //температура град. Цельсия
        uv, //УФ
        feelslike_c, // погода по ощущению в град Цельсия
        humidity, //влажность %
        wind_kph, //скорость ветра км/ч
        pressure_mb, //давление в гПа
        vis_km, //видимость в км
        forecastday, //прогнозы на последующие дни
      });
      localStorage.setItem('city', query);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка:', error); // Логируем ошибку для анализа
      toast.error('Ошибка при попытке загрузки погоды');
      setIsLoading(false);
      localStorage.clear();
      setWeather(null);
      setCity(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const query = formData.get('query').trim().toLowerCase();
    if (query.length === 0) {
      toast.error('Пожалуйста, введите город');
      return;
    }
    await fetchData(query);
    form.reset();
  }

  function WidgetCart({ icon, text, value, unit }) {
    return (
      <div className="border rounded-2xl p-2.5">
        <img className="w-10" src={icon} />
        <p>{text}</p>
        <h3>{`${value} ${unit}`}</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-[600px] mx-auto my-16 rounded-2xl bg-white/60 shadow-lg font-[Roboto]">
      <video
        autoPlay
        muted
        loop
        className="fixed top-0 left-0 w-full h-full object-cover -z-1 brightness-50"
      >
        <source src={cloudBackGround} type="video/mp4" />
        Ваш браузер не поддерживает видео
      </video>
      <div>
        <h1 className="text-center text-6xl m-5 mt-12">Погода</h1>
        <p className="text-center text-3xl m-5 mb-10">
          {new Date()
            .toLocaleString('ru-Ru', { weekday: 'short' })
            .toUpperCase()}{' '}
          {new Date().getDate()}{' '}
          {new Date().toLocaleString('ru-Ru', { month: 'short' }).toUpperCase()}
          , {new Date().getFullYear()}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" grid grid-cols-1 grid-rows-3 text-2xl gap-2.5 mb-12"
      >
        <span className="text-center self-center">Поиск по городу</span>
        <input
          className="bg-white p-2.5 w-[550px] rounded-lg"
          type="text"
          name="query"
          placeholder="Введите название город"
        ></input>
        <button
          type="submit"
          className="bg-blue-400/60 p-2.5 w-[550px] rounded-lg hover:cursor-pointer "
        >
          Узнать погоду
        </button>
      </form>

      {isLoading && (
        <l-line-spinner
          size="60"
          speed="1"
          color="black"
          className="my-12"
        ></l-line-spinner>
      )}

      {weather && (
        <div>
          <div className="my-12 flex flex-col items-center">
            <h3 className="text-2xl mb-2.5">
              {weather.name}, {weather.country}
            </h3>
            <h4>Состояние погоды на данный момент:</h4>
            <img className="w-24" src={weather.icon} />
            <h3 className="mb-2.5">{weather.text}</h3>
            <h2 className="text-3xl">
              {Math.round(weather.temp_c)}
              <sup>°</sup>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <WidgetCart
              icon={uvIcon}
              text="УФ"
              value={Math.round(weather.uv)}
              unit=""
            />
            <WidgetCart
              icon={feelsLikeIcon}
              text="ощущается как"
              value={Math.round(weather.feelslike_c)}
              unit="°C"
            />
            <WidgetCart
              icon={humidityIcon}
              text="влажность"
              value={weather.humidity}
              unit="%"
            />
            <WidgetCart
              icon={windIcon}
              text="скорость ветра"
              value={weather.wind_kph}
              unit="км/ч"
            />
            <WidgetCart
              icon={pressureIcon}
              text="давление"
              value={weather.pressure_mb}
              unit="гПа"
            />
            <WidgetCart
              icon={visIcon}
              text="видимость"
              value={weather.vis_km}
              unit="км"
            />
          </div>

          <div className="flex justify-between mb-12 ">
            {weather.forecastday.map(
              ({
                date,
                day: {
                  maxtemp_c,
                  mintemp_c,
                  condition: { icon },
                },
              }) => {
                return (
                  <p className="border rounded-2xl p-2.5">
                    <p>{date}</p>
                    <img className="mx-auto" src={icon} alt="icon" />
                    <div>
                      <p>
                        <span>Мин: </span>
                        {Math.round(mintemp_c)}
                        <sup>°</sup>
                      </p>
                      <p>
                        <span>Макс: </span>
                        {Math.round(maxtemp_c)}
                        <sup>°</sup>
                      </p>
                    </div>
                  </p>
                );
              }
            )}
          </div>
        </div>
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default App;

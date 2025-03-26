import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { useState, useEffect } from 'react';

export function AstroCard() {
  const sunrise = useSelector(
    (state) => state.weather.weatherData.forecastday[0].astro.sunrise
  );
  const sunset = useSelector(
    (state) => state.weather.weatherData.forecastday[0].astro.sunset
  );
  const isDay = useSelector((state) => state.weather.weatherData.is_day);

  const [progress, setProgress] = useState(0);

  function convertTo24Hour(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  const sunriseConvert = convertTo24Hour(sunrise);
  const sunsetConvert = convertTo24Hour(sunset);

  useEffect(() => {
    function calculateProgress() {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const [sunriseHours, sunriseMinutes] = sunriseConvert
        .split(':')
        .map(Number);
      const [sunsetHours, sunsetMinutes] = sunsetConvert.split(':').map(Number);

      const sunriseInMinutes = sunriseHours * 60 + sunriseMinutes;
      const sunsetInMinutes = sunsetHours * 60 + sunsetMinutes;
      let currentInMinutes = currentHours * 60 + currentMinutes;

      let zeroPercent, oneHundredPercent;

      if (isDay === 1) {
        // День: от восхода до заката
        zeroPercent = sunriseInMinutes;
        oneHundredPercent = sunsetInMinutes;
      } else {
        // Ночь: от заката до следующего восхода
        zeroPercent = sunsetInMinutes;
        oneHundredPercent = sunriseInMinutes + 24 * 60; // Следующий восход через 24 часа
        if (currentInMinutes < sunsetInMinutes) {
          currentInMinutes += 24 * 60; // Учитываем переход через полночь
        }
      }

      const totalValue = oneHundredPercent - zeroPercent;
      const currentValue = currentInMinutes - zeroPercent;

      let calculatedProgress = 0;
      if (currentInMinutes < zeroPercent) {
        calculatedProgress = 0;
      } else if (currentInMinutes > oneHundredPercent) {
        calculatedProgress = 100;
      } else {
        calculatedProgress = (currentValue / totalValue) * 100;
      }

      return calculatedProgress;
    }

    setProgress(calculateProgress());
  }, [sunriseConvert, sunsetConvert, isDay]);

  function iconBar() {
    let path = 'src/icons/sun.svg';
    if (isDay === 0) {
      path = 'src/icons/moon.svg';
    }
    return path;
  }

  return (
    <div className="Card rounded-[10px] w-[380px] bg-linear-to-b from-lightFrom to-lightTo grid grid-rows-2 grid-cols-2 gap-14 px-6 pt-6">
      <div className="grid grid-cols-2">
        <ReactSVG
          className="theme-icon-path row-span-2 self-center"
          src="src/icons/sunrise.svg"
        />
        <span>Восход</span>
        <span>{sunriseConvert}</span>
      </div>
      <div className="grid grid-cols-2">
        <ReactSVG
          className="theme-icon-path row-span-2 self-center"
          src="src/icons/sunset.svg"
        />
        <span>Закат</span>
        <span>{sunsetConvert}</span>
      </div>

      <div className="progressBar relative w-full h-5 bg-white/30 border-2 border-pBarlightDone rounded-full col-span-2 ">
        <div
          className="progressBarDone absolute top-0 left-0 h-full rounded-full bg-pBarlightDone transition-all duration-1000 ease-in-out "
          style={{ width: `${progress}%` }}
        />
        <div
          className="ellipse absolute top-1/2 transform -translate-y-1/2 w-[42px] h-[42px] bg-ellipseLight border-2 border-pBarlightDone rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{ left: `calc(${progress}% - 21px)` }}
        />
        <ReactSVG src={iconBar()} className='absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out' style={{ left: `calc(${progress}% - 16px)` }}/>
      </div>
    </div>
  );
}

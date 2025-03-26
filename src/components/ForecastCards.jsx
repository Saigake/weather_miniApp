import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

export function ForecastCards() {
  const forecast = useSelector(
    (state) => state.weather.weatherData.forecastday
  );
  const weatherGroups = useSelector((state) => state.weather.weatherGroups);

  return (
    <>
      {forecast.map(
        ({
          date_epoch,
          day: {
            maxtemp_c,
            mintemp_c,
            condition: { code },
          },
        }) => {
          const date = new Date(date_epoch * 1000);
          const weekday = new Intl.DateTimeFormat('ru-RU', {
            weekday: 'long',
          }).format(date);
          const capitalizedWeekday =
            weekday.charAt(0).toUpperCase() + weekday.slice(1);
          const day = date.getDate();
          const month = new Intl.DateTimeFormat('ru-RU', {
            month: '2-digit',
          }).format(date);
          const year = date.getFullYear();

          const group =
            Object.entries(weatherGroups).find(([_, group]) =>
              group.codes.includes(code)
            )?.[0] || 'src/icons/clear.svg';

          const svgPath = weatherGroups[group].svgPath;

          return (
            <div
              key={date}
              className="Card w-[180px] rounded-[10px] bg-linear-to-b from-lightFrom to-lightTo px-[25px] py-[15px] grid grid-cols-2 gap-y-2.5 gap-x-5"
            >
              <h3 className="text-lg col-span-2 text-center">
                {capitalizedWeekday}
              </h3>
              <p className="text-sm col-span-2 text-center">
                {day}-{month}-{year}
              </p>
              <ReactSVG
                src={svgPath}
                className="col-span-2 theme-icon-path justify-items-center"
              />
              <span className="text-2xl text-end">
                {Math.round(maxtemp_c)}°
              </span>
              <span className="text text-2xl  text-start ">
                {Math.round(mintemp_c)}°
              </span>
            </div>
          );
        }
      )}
    </>
  );
}

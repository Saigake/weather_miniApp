import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&q=${query}&days=3&aqi=no&alerts=no&lang=ru`
      );

      const {
        location: { name, country },
        current: {
          condition: { text, code },
          temp_c,
          uv,
          feelslike_c,
          humidity,
          wind_kph,
          pressure_mb,
          vis_km,
          is_day,
        },
        forecast: { forecastday },
      } = response.data;
      return {
        name, //название города
        country, //название страны
        text, //текстовое описание погоды
        code, //код погоды
        temp_c, //температура, град Цельсия
        uv, //УФ
        feelslike_c, //температура по ощущению
        humidity, //влажность
        wind_kph, //скорость ветра км/ч
        pressure_mb, //давление в гПа
        vis_km, //видимость в км
        is_day, //день = 1/ ночь = 0
        forecastday, //погода на след. дни
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Ошибка при загрузке погоды'
      );
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    weatherData: null,
    city: localStorage.getItem('city') || null,
    loading: false,
    error: null,
    weatherGroups: {
      clear: {
        codes: [1000, 1003], // Ясно
        colors: ['#ffe100', '#009dff'], //ok
        svgPath: 'src/icons/clear.svg',
      },
      cloudy: {
        codes: [1006, 1009], // Облачно и пасмурно
        colors: ['#ffffff', '#009dff'], //ok
        svgPath: 'src/icons/cloudy.svg',
      },
      mist: {
        codes: [1030, 1135, 1147], // Туман и дымка
        colors: ['#ffffff', '#ffffff'], //ok
        svgPath: 'src/icons/.svg',
      },
      rain: {
        codes: [
          1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243,
          1246,
        ], // Дождь и морось
        colors: ['#4e00a1', '#009dff'], //ok
        svgPath: 'src/icons/rain.svg',
      },
      snow: {
        codes: [
          1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258,
          1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252,
          1261, 1264,
        ], // Снег и метели
        colors: ['#ffffff', '#4e00a1'], //ok
        svgPath: 'src/icons/snow.svg',
      },
      thunder: {
        codes: [1087, 1273, 1276, 1279, 1282], // Гроза и молнии
        colors: ['#4e00a1', '#ffe100'], //ok
        svgPath: 'src/icons/thunder.svg',
      },
    },
    color1: '#ffe100',
    color2: '#009dff',
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
      localStorage.setItem('city', action.payload);
    },
    clearWeather: (state) => {
      state.weatherData = null;
      state.city = null;
      state.error = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload;
        const code = state.weatherData?.code ?? null;
        if (code) {
          const group =
            Object.entries(state.weatherGroups).find(([_, group]) =>
              group.codes.includes(code)
            )?.[0] || 'clear';
          state.color1 = state.weatherGroups[group].colors[0];
          state.color2 = state.weatherGroups[group].colors[1];
        } else {
          state.color1 = state.weatherGroups['clear'].colors[0];
          state.color2 = state.weatherGroups['clear'].colors[1];
        }
        console.log(`Код погоды: ${state.weatherData.code}`);
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.weatherData = null;
        state.color1 = state.weatherGroups['clear'].colors[0];
        state.color2 = state.weatherGroups['clear'].colors[1];
      });
  },
});

export const { setCity, clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;

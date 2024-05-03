import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatehrIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatehrIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
  } = props;
  return (
    <Container className="gap-4">
      <section className=" flex items-center gap-4 px-4">
        <div className=" flex flex-col items-center gap-1">
          <WeatherIcon iconName={weatehrIcon} />
          <p>{date}</p>
          <p className="text-sm">{day} </p>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="space-x-1 whitespace-nowrap text-xs">
            <span> Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize"> {description}</p>
        </div>
      </section>
      <section className="flex w-full justify-between gap-4 overflow-x-auto px-4 pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}

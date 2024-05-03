"use client";

import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { WeatherData } from "@/interfaces";

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.OPENWEATHER_API_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* @ts-ignore */}
        <p className="text-red-400">{error.message}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gray-300">
      <Navbar location={data?.city.name} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-9  px-3  pb-10 pt-4 ">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4 ">
              <div className="space-y-2">
                <h2 className="flex items-end gap-1 text-2xl ">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className=" items-center gap-10 px-6">
                  <div className=" flex flex-col px-4 ">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="space-x-1 whitespace-nowrap text-xs">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="space-x-2 text-xs">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  <div className="flex w-full justify-between gap-10 overflow-x-auto pr-3 sm:gap-16">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-between gap-2 text-xs font-semibold "
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className=" flex gap-4">
                <Container className="w-fit flex-col items-center justify-center px-4 ">
                  <p className=" text-center capitalize">
                    {firstData?.weather[0].description}{" "}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="justify-between gap-4 overflow-x-auto bg-yellow-300/80 px-6">
                  <WeatherDetails
                    visibility={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                    sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>
            <section className="flex w-full flex-col gap-4  ">
              <p className="text-2xl">Forecast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatehrIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      <div className="animate-pulse space-y-2">
        <div className="flex items-end gap-1 text-2xl ">
          <div className="h-6 w-24 rounded bg-gray-300"></div>
          <div className="h-6 w-24 rounded bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 rounded bg-gray-300"></div>
              <div className="h-6 w-6 rounded-full bg-gray-300"></div>
              <div className="h-6 w-16 rounded bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex animate-pulse flex-col gap-4">
        <p className="h-8 w-36 rounded bg-gray-300 text-2xl"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 gap-4 md:grid-cols-4 ">
            <div className="h-8 w-28 rounded bg-gray-300"></div>
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="h-8 w-28 rounded bg-gray-300"></div>
            <div className="h-8 w-28 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

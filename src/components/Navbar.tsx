"use client";

import React from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

const API_KEY = process.env.OPENWEATHER_API_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChang(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }
  return (
    <>
      <nav className="sticky  left-0 top-0 z-50 bg-black shadow-sm">
        <div className="mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between px-3">
          <p className="flex items-center justify-center gap-2  ">
            <h2 className="text-3xl text-white">Synoptic</h2>
            <MdWbSunny className="mt-1 text-3xl text-yellow-400" />
          </p>
          <section className="flex items-center gap-2">
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="cursor-pointer text-2xl text-white hover:opacity-80"
            />
            <MdOutlineLocationOn className="text-3xl text-white" />
            <p className="text-sm text-white">{location}</p>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmiSearch}
                onChange={(e) => handleInputChang(e.target.value)}
              />
              <SuggetionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmiSearch}
            onChange={(e) => handleInputChang(e.target.value)}
          />
          <SuggetionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggetionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="absolute left-0 top-[44px] mb-4 flex min-w-[200px] flex-col gap-1 rounded-md border border-gray-300 bg-white px-2 py-2">
          {error && suggestions.length < 1 && (
            <li className="p-1 text-red-500"> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer rounded p-1 hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

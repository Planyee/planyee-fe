"use client";
import React from "react";
import { useState } from "react";
import { Group, Stack } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import Input from "../input/page";
import { useRecoilValue, useRecoilState } from "recoil";
import { useSetRecoilState } from "recoil";
import {
  selectedDateState,
  srcLocationState,
  destLocationState,
  translatedLocationState,
  additionalInputState,
} from "@/state/states";
import { planState } from "@/state/states";
import Select from "@/components/Select";

interface PlanpageProps {
  // 여기에 필요한 props 타입을 정의하세요
}

interface Coordinate {
  sourceLatitude: string;
  sourceLongitude: string;
  destinationLatitude: string;
  destinationLongitude: string;
}

interface TranslatedCoordinate {
  departure: string;
  destination: string;
}

export default function Plan(props: PlanpageProps) {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  const selectedDate = useRecoilValue(selectedDateState);

  const srcLocation  = useRecoilValue(srcLocationState);
  const destLocation = useRecoilValue(destLocationState);
  const translatedLocation = useRecoilValue(translatedLocationState);

  const [isPopupOpen, setPopupOpen] = useState(false);

  const setadditionalInputState = useSetRecoilState(additionalInputState);

  const setplanstate = useSetRecoilState(planState);

  const onsubmithandler = (e) => {
    e.preventDefault();
    setadditionalInputState({
      input: e.target.value,
    });
  }

  const handleCategoryClick = () => {
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
  };

  const [coordinate, setCoordinate] = useState<Coordinate>({
    sourceLatitude: "",
    sourceLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
  });

  const [translatedCoordinate, setTranslatedCoordinate] =
    useState<TranslatedCoordinate>({
      departure: "",
      destination: "",
    });

  const [whatclicked, setWhatclicked] = useState<string>("");
  const [inputclicked, setInputclicked] = useState<boolean>(false);

  const departureclickhandler = () => {
    setInputclicked(true);
    setWhatclicked("departure");
  };

  const destinationclickhandler = () => {
    setInputclicked(true);
    setWhatclicked("destination");
  };

  const mapclickhandler = () => {
    setInputclicked(false);
  };

  const onconfirmhandler = () => {
    setplanstate({
      date: selectedDate.year.toString()+"-"+selectedDate.month.toString()+"-"+selectedDate.day.toString(),
      planName: "오늘의 일정",
      sourceLatitude: srcLocation.latitude,
      sourceLongitude: srcLocation.longitude,
      destinationLatitude: destLocation.latitude,
      destinationLongitude: destLocation.longitude,
      planPreferedPlaces: [],
      additionalCondition: "",//수정필요
    });
    console.log("planstate", planState);
  };

  const getvalue = async (address: string, lat: string, lon: string) => {
    if (whatclicked === "departure") {
      console.log("departure값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
          ...prevState,
          sourceLatitude: lat,
          sourceLongitude: lon,
        };
      });

      setTranslatedCoordinate((prevState) => {
        return {
          ...prevState,
          departure: address,
        };
      });
    } else if (whatclicked === "destination") {
      console.log("destination값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
          ...prevState,
          destinationLatitude: lat,
          destinationLongitude: lon,
        };
      });

      setTranslatedCoordinate((prevState) => {
        return {
          ...prevState,
          destination: address,
        };
      });
    }
  };

  return inputclicked ? (
    <Input
      clickstate={whatclicked}
      propsfunction={getvalue}
      onMapClick={mapclickhandler}
    />
  ) : (
    <div className="h-screen relative">
      <Stack className="text-center">
        <p className="gap-7 mt-12 text-lg font-semibold">일정 등록</p>
        <Link href="/main" className="absolute mt-12 right-0">
          <button>
            <Image
              src="/images/close.svg"
              alt="Close"
              width={25}
              height={25}
              className="text-[#2C7488]"
            />
          </button>
        </Link>
        <Stack>
          <p>날짜</p>
          <Link href="/main">
          <button className="rounded-full border border-gray-200 text-[#2C7488] font-medium mx-auto w-4/5 h-[50px] hover:bg-gray-100">
            {selectedDate.year
              ? `${selectedDate.year}년 ${selectedDate.month}월 ${selectedDate.day}일`
              : ""}
          </button>
          </Link>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </Stack>

        <Stack>
          <p>장소</p>
          <button
            onClick={departureclickhandler}
            className="rounded-full border border-gray-200 mx-auto w-4/5 h-[50px] hover:bg-gray-100"
          >
            <Group className="ml-4">
              <Image
                src="/images/logo_color.svg"
                alt="Logo"
                width={25}
                height={25}
                className="text-[#2C7488]"
              />
              <p className={`${translatedCoordinate.departure ? 'text-black' : ''} text-gray-300`}>
                {translatedCoordinate.departure || "출발지 입력"}
              </p>
            </Group>
          </button>
          <button
            onClick={destinationclickhandler}
            className="rounded-full border border-gray-200 mx-auto w-4/5 h-[50px] hover:bg-gray-100"
          >
            <Group className="ml-4">
              <Image
                src="/images/logo_color.svg"
                alt="Logo"
                width={25}
                height={25}
                className="text-[#2C7488]"
              />
              <p className={`${translatedCoordinate.destination ? 'text-black' : ''} text-gray-300`}>
                {translatedCoordinate.destination || "도착지 입력"}
              </p>
            </Group>
          </button>
          <div className="border-b border-gray-400 w-full my-4"></div>
        </Stack>

        <Stack>
          <p>카테고리</p>
          <button
            className="rounded-full hover:bg-gray-100 border border-gray-200 mx-auto w-2/5 h-[40px] "
            onClick={handleCategoryClick}
          >
            카테고리
          </button>

          {/* 팝업 창 */}
          {isPopupOpen && <Select onClose={handleClose} />}
        </Stack>
        <Stack>
          <form onSubmit={onsubmithandler}>
          <input className="rounded-full hover:bg-gray-100 border border-gray-200 mx-auto w-2/5 h-[40px] text-center" placeholder="스타일 추가 입력" type="text" />
          </form>
        </Stack>
      </Stack>

      <div className="absolute bottom-5 w-full">
        <Link href="/day">
          <button className="bg-[#CB475B] text-white w-full h-10" onClick={onconfirmhandler}>확인</button>
        </Link>
      </div>
    </div>
  );
}

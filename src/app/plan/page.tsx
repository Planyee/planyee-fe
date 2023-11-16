"use client";
import React, { useEffect } from "react";
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
  planState,
} from "@/state/states";
import Select from "@/components/Select";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  const selectedDate = useRecoilValue(selectedDateState);

  const srcLocation = useRecoilValue(srcLocationState);
  const destLocation = useRecoilValue(destLocationState);
  const translatedLocation = useRecoilValue(translatedLocationState);

  const [isPopupOpen, setPopupOpen] = useState(false);

  const setadditionalInputState = useSetRecoilState(additionalInputState);
  const setPlanState = useSetRecoilState(planState);

  const [plan, setPlan] = useRecoilState(planState);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    setadditionalInputState({
      input: e.target.value,
    });
  };

  const additionalInputStateValue = useRecoilValue(additionalInputState);

  useEffect(() => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      additionalCondition: additionalInputStateValue.input,
    }));
  }, [additionalInputStateValue]);

  useEffect(() => {
    const { year, month, day } = selectedDate;
    const formattedDate = `${year}-${month}-${day}`;

    setPlan((prevPlan) => ({
      ...prevPlan,
      date: formattedDate,
    }));
  }, [selectedDate, setPlan]);

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

  const onconfirmhandler = async () => {
    try {
      const response = await fetch("http://43.202.89.97:52458/main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다.");
      }

      const responseData = await response.json();
      console.log("백엔드 응답:", responseData);

      router.push("/list");
    } catch (error) {
      console.error("에러:", error);
    }
  };

  const getvalue = async (address: string, lat: string, lon: string) => {
    if (whatclicked === "departure") {
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

      setPlanState((prevState) => {
        return {
          ...prevState,
          sourceLatitude: lat,
          sourceLongitude: lon,
        };
      });
    } else if (whatclicked === "destination") {
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

      setPlanState((prevState) => {
        return {
          ...prevState,
          destinationLatitude: lat,
          destinationLongitude: lon,
        };
      });
    }
  };

  return inputclicked ? (
    <Input
      clickstate={whatclicked as "departure" | "destination"}
      propsfunction={getvalue}
      onMapClick={mapclickhandler}
    />
  ) : (
    <div className="h-screen relative">
      <Group className="flex text-center mt-2">
        <Link href="/main" className="absolute left-0">
          <button>
            <Image src="/images/prev.svg" alt="prev" width={15} height={15} />
          </button>
        </Link>
        <p className="text-2xl mx-auto font-semibold">일정 등록</p>
        <Link href="/main" className="absolute right-0">
          <button>
            <Image src="/images/close.svg" alt="close" width={15} height={15} />
          </button>
        </Link>
      </Group>

      <div className="overflow-y-auto h-[calc(100% - 5rem)] pb-20">
        <Stack className="text-center gap-7 mt-12">
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
                <p
                  className={`${
                    translatedCoordinate.departure
                      ? "text-black"
                      : "text-gray-300"
                  }`}
                >
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
                <p
                  className={`${
                    translatedCoordinate.destination
                      ? "text-black"
                      : "text-gray-300"
                  }`}
                >
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

            {isPopupOpen && <Select onClose={handleClose} />}
          </Stack>
          <Stack>
            <form>
              <input
                className="rounded-full hover:bg-gray-100 border border-gray-200 mx-auto w-2/5 h-[40px] text-center"
                placeholder="스타일 추가 입력"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
            </form>
          </Stack>
        </Stack>
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <button
          className="bg-[#CB475B] text-white w-full h-16"
          onClick={onconfirmhandler}
        >
          확인
        </button>
      </div>
    </div>
  );
}

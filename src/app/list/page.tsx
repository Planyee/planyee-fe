"use client";
import React, { useEffect, useState } from "react";
import { Stack, Group } from "@mantine/core";
import Map from "@/app/map/page";
import Link from "next/link";
import Image from "next/image";
import "./Contentlistpage.css";

const ContentList: React.FC = () => {
  const [source, setSource] = useState<string>(""); // 출발지
  const [destination, setDestination] = useState<string>(""); // 도착지
  const [shortaddress, setShortAddress] = useState<any>({
    source: "",
    destination: "",
  }); // 출발지, 도착지 짧은 주소
  const [contents, setContents] = useState<JSX.Element[]>([]); // 내용

  const [MapClick, setMapClick] = useState<boolean>(false); // 클릭 여부

  const onclickhandler = (): void => {
    setMapClick((MapClick) => !MapClick);
  };

  interface Location {
    latitude: number;
    longitude: number;
  }

  interface Recommendation {
    name: string;
    mainCategory: string[];
    subCategory: string[];
    address: string;
    latitude: number;
    longitude: number;
  }

  interface ArrayType {
    source: Location;
    destination: Location;
    recommendations: Recommendation[];
  }

  const array: ArrayType = {
    source: {
      latitude: 37.5504917587033,
      longitude: 126.98504447937,
    },
    destination: {
      latitude: 37.5004238916111,
      longitude: 126.9965457916111,
    },
    recommendations: [
      {
        name: "경복궁",
        mainCategory: ["랜드마크", "~~"],
        subCategory: ["명소", "고궁"],
        address: "서울 중구 세종대로 41",
        latitude: 37.53104238916314,
        longitude: 126.9965457916264,
      },
      {
        name: "경복궁1",
        mainCategory: ["랜드마크", "~~"],
        subCategory: ["음식", "한식"],
        address: "서울 중구 세종대로 42",
        latitude: 37.4104238916315,
        longitude: 126.996545791625,
      },
    ],
  };

  async function ReverseGeocoding(lng: number, lat: number): Promise<string> {
    const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
    const url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A03&lon=${lng}&lat=${lat}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          appKey: appKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.addressInfo.fullAddress; // 풀 주소를 반환
    } catch (error) {
      console.error("Error fetching the address:", error);
      return ""; // 에러 발생 시 빈 문자열 반환
    }
  }

  async function shortReverseGeocoding(lng: number, lat: number): Promise<string> {
    const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
    const url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A03&lon=${lng}&lat=${lat}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          appKey: appKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.addressInfo.city_do + " " + data.addressInfo.gu_gun; // 풀 주소를 반환
    } catch (error) {
      console.error("Error fetching the address:", error);
      return ""; // 에러 발생 시 빈 문자열 반환
    }
  }

  useEffect(() => {
    async function GetAddress() {
      var sourceaddress = await ReverseGeocoding(
        array.source.longitude,
        array.source.latitude
      );

      var destinationaddress = await ReverseGeocoding(
        array.destination.longitude,
        array.destination.latitude
      );
      
      var shortsourceaddress = await shortReverseGeocoding(
        array.source.longitude,
        array.source.latitude
      );
       
      var shortdestinationaddress = await shortReverseGeocoding(
        array.destination.longitude,
        array.destination.latitude
      );
      setSource(sourceaddress);
      setDestination(destinationaddress);
      setShortAddress({
        source: shortsourceaddress,
        destination: shortdestinationaddress,
      });
    }
    GetAddress();

    setContents(
      array?.recommendations.map((recommendation, index) => (
        <Group>
          <React.Fragment>
            <img
              src="/images/UI_image/information_bar_2.png"
              alt="Information Bar"
            />
            <span>경유지</span>
            {recommendation.address}
          </React.Fragment>
        </Group>
      ))
    );
  }, []); // 실제 백엔드와 통신할 시에는 배열 추가 필요

  return MapClick ? (
    <Map locations={array} onbuttonclickhandler={onclickhandler} />
  ) : (
    <div className="h-screen relative flex flex-col items-center w-full">
      <div className="gap-7 mt-12 text-lg font-semibold"></div>
      <Stack className="flex flex-col gap-4">
        <Group>
          <Link href="/plan" className="absolute mt-10 left-0">
            <button>
            <Image
                src="/images/UI_image/chevron.left.png"
                alt="Close"
                width={15}
                height={15}
                className="text-[#2C7488]"
              />
            </button>
          </Link>
          <span className="font-semibold">{shortaddress.source} - {shortaddress.destination}</span>
          <Link href="/main" className="absolute mt-10 right-0">
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
        </Group>
        <div className="date_departure_destination">
          <Stack>
            <Group>
              <img src="/images/UI_image/information_bar.png" />
              <span>출발지</span>
              {source}
            </Group>
            {contents}
            <Group>
              <img src="/images/UI_image/information_bar.png" />
              <span>도착지</span>
              {destination}
            </Group>
          </Stack>
        </div>
      </Stack>
      <div className="absolute bottom-5 w-full">
        <button onClick={onclickhandler} className="bg-[#2C7488] text-white w-full h-10">
          <img src="/images/UI_image/pathsearch.png" alt="Pathsearch" className="pathsearch"/>
          경로 탐색
        </button>
      </div>
    </div>
  );
};

export default ContentList;

"use client";
import React, { useEffect, useState } from "react";
import "./Contentlistpage.css";
import Mappage from "../mappage/page";

const ContentList: React.FC = () => {
  const [source, setSource] = useState<string>(""); // 출발지
  const [destination, setDestination] = useState<string>(""); // 도착지
  const [contents, setContents] = useState<JSX.Element[]>([]); // 내용

  const [MapClick, setMapClick] = useState<boolean>(false); // 클릭 여부

  const ontestclickhandler = (): void => {
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
      latitude: 37.5504917587033000,
      longitude: 126.98504447937000,
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
        longitude: 126.9965457916250,
      }
    ]
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

  useEffect(() => {
    async function fetch() {
      var sourceaddress = await ReverseGeocoding(
        array.source.longitude,
        array.source.latitude
      );

      var destinationaddress = await ReverseGeocoding(
        array.destination.longitude,
        array.destination.latitude
      );

      setSource(sourceaddress);
      setDestination(destinationaddress);
    }
    fetch();

    setContents(
      array?.recommendations.map((recommendation, index) => (
        <li key={index}>
          <img
            src="/images/UI_image/information_bar_2.png"
            alt="Information Bar"
          />
          <span>경유지</span>
          {recommendation.address}
        </li>
      ))
    );
  }, []); // 실제 백엔드와 통신할 시에는 배열 추가 필요

  return MapClick ? (
    <Mappage locations={array} onbuttonclickhandler={ontestclickhandler} />
  ) : (
    <div>
      <div className="upper_nav">
        <button className="prev">이전</button>
        <span>일정확인</span>
        <button className="close">닫기</button>
      </div>
      <div className="date_departure_destination">
        <ul>
          <li key="0">
            <img src="/images/UI_image/information_bar.png" />
            <span>출발지</span>
            {source}
          </li>
          {contents}
          <li key="100">
            <img src="/images/UI_image/information_bar.png" />
            <span>도착지</span>
            {destination}
          </li>
        </ul>
      </div>
      <div className="lower_nav">
        <button onClick={ontestclickhandler}>경로탐색</button>
      </div>
    </div>
  );
};

export default ContentList;

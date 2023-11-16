"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import {
  srcLocationState,
  destLocationState,
  translatedLocationState,
} from "@/state/states";

// props의 타입을 정의합니다.
interface InputProps {
  clickstate: "departure" | "destination";
  propsfunction: (address: string, lat: any, lon: any) => void;
  onMapClick: () => void;
}

const Input: React.FC<InputProps> = (props) => {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  let map: any, marker: any;
  let markerArr: any[] = [];
  let infowindows: any[] = [];
  let lonlat: any;
  let infoWindow: any;
  const mapRef = useRef<any>(null);

  const setsrcLocationState = useSetRecoilState(srcLocationState);
  const setdestLocationState = useSetRecoilState(destLocationState);
  const settranslatedLocationState = useSetRecoilState(translatedLocationState);

  useEffect(() => {
    console.log("useEffect"); //@ts-ignore
    if (!mapRef.current && window.Tmapv2) {
      //@ts-ignore
      mapRef.current = new window.Tmapv2.Map(mapRef.current, {
        //@ts-ignore
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%",
        height: "890px",
        zoom: 18,
      });
      mapRef.current.addListener("click", onclickhandler);
    }
  }, []);

  async function ReverseGeocoding(lng: any, lat: any) {
    const url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A03&lon=${lng}&lat=${lat}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          appKey: appKey,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const data = await response.json();
      const address = data.addressInfo.fullAddress;
      return address;
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  const onconfirmhandler = () => {
    props.onMapClick();
  };

  function markerset(lonlat: any) {
    removeMarkers();
    //@ts-ignore
    marker = new window.Tmapv2.Marker({
      //@ts-ignore
      position: new window.Tmapv2.LatLng(lonlat.lat(), lonlat.lng()),
      icon: "/images/UI_image/redping.png",
      map: map,
    });
    markerArr.push(marker);
  }

  function removeMarkers() {
    for (let i = 0; i < markerArr.length; i++) {
      markerArr[i].setMap(null);
    }
    markerArr = [];
  }

  function popupManage(address: any) {
    let state: any;
    if (props.clickstate === "departure") {
      state = "출발지";
    } else if (props.clickstate === "destination") {
      state = "도착지";
    }
    //information_bar.png 잊지말고 넣기!
    const content = `
    <div class="relative bg-no-repeat rounded-lg shadow-md py-2 px-2 w-60 h-28 bg-white">
      <img class="absolute m-2" src="/images/UI_image/short_information_bar.png"/>
      <div class="text-xs font-normal font-NotoSansKR text-center absolute top-4 left-10">${state}</div>
      <div class="text-xs font-normal font-NotoSansKR text-center absolute top-10 left-10">${address}</div>
    </div>
  `;
    removeinfowindows();
    //@ts-ignore
    infoWindow = new window.Tmapv2.InfoWindow({
      //@ts-ignore
      position: new window.Tmapv2.LatLng(lonlat.lat(), lonlat.lng()),
      map: map,
      content: content,
      type: 2,
      background: false,
      border: false,
    });
    infowindows.push(infoWindow);
  }

  const removeinfowindows = () => {
    for (let i = 0; i < infowindows.length; i++) {
      infowindows[i].setMap(null);
    }
    infowindows = [];
  };

  async function onclickhandler(e: any) {
    console.log("클릭됨");
    lonlat = e.latLng;
    const address = await ReverseGeocoding(lonlat._lng, lonlat._lat);
    setsrcLocationState((prevState) => {
      return {
        ...prevState,
        srcLatitude: lonlat._lat,
        srcLongitude: lonlat._lng,
      };
    });
    setdestLocationState((prevState) => {
      return {
        ...prevState,
        destLatitude: lonlat._lat,
        destLongitude: lonlat._lng,
      };
    });
    settranslatedLocationState((prevState) => {
      return {
        ...prevState,
        departure: address,
        destination: address,
      };
    });
    await markerset(lonlat);
    props.propsfunction(address, lonlat._lat, lonlat._lng);
    await popupManage(address);
  }
  return (
    <>
      <div className="h-screen relative">
        <div className="BaseMap" ref={mapRef} />
        <div className="absolute bottom-5 w-full">
          <Link href="/plan">
            <button
              onClick={onconfirmhandler}
              className="bg-[#CB475B] text-white w-full h-12"
            >
              확인
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
export default Input;

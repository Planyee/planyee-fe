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
  clickstate: string;
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
  const mapRef = useRef<HTMLDivElement>(null);

  const setsrcLocationState = useSetRecoilState(srcLocationState);
  const setdestLocationState = useSetRecoilState(destLocationState);
  const settranslatedLocationState = useSetRecoilState(translatedLocationState);

  useEffect(() => {
    console.log("useEffect");
    if (!map && window.Tmapv2 && mapRef.current) {
      map = new window.Tmapv2.Map(mapRef.current, {
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%",
        height: "890px",
        zoom: 18,
      });
      map.addListener("click", onclickhandler);
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
    marker = new window.Tmapv2.Marker({
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
    <div style="position: relative; background-repeat: no-repeat; border-radius: 20px; box-shadow: 2px 1px 3px #4b4b4b;
    line-height: 18px; padding: 2px 35px 2px 2px; width: 250px; height: 110px; background-color: #fff;">
      <img style="position: absolute; margin: 10px 10px" src="/images/UI_image/short_information_bar.png"/>
      <div style="font-size: 12px; font-family: Noto Sans KR; font-size: 15px;
      font-weight: 400; position: absolute; line-height: 15px; top: 15px; margin-left: 30px; text-align: center;">${state}</div>
      <div style="font-size: 12px; font-family: Noto Sans KR; font-size: 15px;
      font-weight: 400; position: absolute; line-height: 15px; top: 40px; margin-left:30px; text-align: center;">${address}</div>
    </div>
  `;
    removeinfowindows();
    infoWindow = new window.Tmapv2.InfoWindow({
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

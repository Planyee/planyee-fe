'use client';
import React, { useEffect, useRef, useState } from "react";
import "./inputpage.css";

// props의 타입을 정의합니다.
interface InputpageProps {
  clickstate: string;
  propsfunction: (address: string, lat: number, lon: number) => void;
  onMapClick: () => void;
}

const Inputpage: React.FC<InputpageProps> = (props) => {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  let map: any, marker: any;
  let markerArr: any[] = [];
  let infowindows: any[] = [];
  let lonlat: any;
  let infoWindow: any;
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
    document.head.appendChild(script);
    script.onload = () => {
      console.log("script onload");
      if (!map && window.Tmapv2 && mapRef.current) {
        map = new window.Tmapv2.Map(mapRef.current, {
          center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
          width: "100%",
          height: "890px",
          zoom: 18,
        });
        map.addListener("touchend", onclickhandler);
      }
    };
  }, []);

  const onconfirmhandler = () => {
    props.onMapClick();
  };

  async function ReverseGeocoding(lng: number, lat: number) {
    const url =
      `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A03&lon=${lng}&lat=${lat}`;
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

  function markerset(lonlat: any) {
    removeMarkers();
    marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lonlat.lat(), lonlat.lng()),
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

  function popupManage(address: string) {
    let state: string;
    if (props.clickstate === "departure") {
      state = "출발지";
    } else if (props.clickstate === "destination") {
      state = "도착지";
    }
    const content = `
    <div style="position: relative; background-repeat: no-repeat; border-radius: 20px; border: 2px solid #000; 
    line-height: 18px; padding: 2px 35px 2px 2px; width: 200px; height: 90px; background-color: #fff;">
      <img style="position: absolute; margin: 5px 5px" src="/information_bar.png"/>
      <div style="font-size: 12px; font-family: Noto Sans KR; font-size: 15px;
      font-weight: 400; position: absolute; line-height: 15px; margin: 4px 35px; text-align: center;">${state}</div>
      <div style="font-size: 12px; font-family: Noto Sans KR; font-size: 15px;
      font-weight: 400; position: absolute; line-height: 15px; margin: 20px 35px; text-align: center;">${address}</div>
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
    lonlat = e.latLng;
    const address = await ReverseGeocoding(lonlat._lng, lonlat._lat);
    await markerset(lonlat);
    props.propsfunction(address, lonlat._lat, lonlat._lon);
    await popupManage(address);
  }

  return (
    <div>
      <div>
        <div className="BaseMap" ref={mapRef} />
        <div className="user_input_confirm" onClick={onconfirmhandler}>
          확인
        </div>
      </div>
    </div>
  );
};

export default Inputpage;

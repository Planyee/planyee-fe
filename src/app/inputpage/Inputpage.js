"use client";
import React, { useEffect, useRef, useState } from "react";
import "./inputpage.css";

const Inputpage = (props) => {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  var map, marker;
  var markerArr = [];
  var infowindows = [];
  var lonlat, lon, lng;
  var infoWindow;
  var List_information = [];
  const mapRef = useRef(null);
  const [clickedpositions, setClickedpositions] = useState(null);
  const [userdata, setUserdata] = useState("");
  const [innerHtml, setinnerHtml] = useState("");
  const [ispoi, setIspoi] = useState(false);

  useEffect(() => {
    
    if (!map && window.Tmapv2 && mapRef.current) {
      map = new window.Tmapv2.Map(mapRef.current, {
        // 지도가 생성될 div
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%", // 지도의 넓이
        height: "890px", // 지도의 높이
        zoom: 18,
      });
      map.addListener("touchend", onclickhandler);
    }
  }, []);

  const onconfirmhandler = (event) => {
    props.onMapClick();
  };

  async function ReverseGeocoding(lng, lat) {
    //역 지오 코딩 함수
    const url =
      "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A03&lon=" +
      lng +
      "&lat=" +
      lat;
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
      return address; // 풀 주소를 반환함
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  function markerset(lonlat) {
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();
    //Marker 객체 생성.
    marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lonlat.lat(), lonlat.lng()), //Marker의 중심좌표 설정.
      map: map, //Marker가 표시될 Map 설정.
    });
    markerArr.push(marker);
  }

  function removeMarkers() {
    for (var i = 0; i < markerArr.length; i++) {
      markerArr[i].setMap(null);
    }
    markerArr = [];
  }

  function popupManage(address) {
    var state;
    if (props.clickstate == "departure") {
      state = "출발지";
    } else if (props.clickstate == "destination") {
      state = "도착지";
    }
    var content = `
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
    for (var i = 0; i < infowindows.length; i++) {
      infowindows[i].setMap(null);
    }
    infowindows = [];
  };

  async function onclickhandler(e) {
    //맵 클릭시 발생하는 이벤트 핸들러
    lonlat = e.latLng;
    console.log(lonlat);
    console.log(lonlat._lon, lonlat._lat);
    var address = await ReverseGeocoding(lonlat._lng, lonlat._lat); //역 지오코딩 호출
    
    await markerset(lonlat); // 지도에 마커를 작성함
    props.propsfunction(address, lonlat._lat, lonlat._lon); //위도 + 경도 정보를 부모 컴포넌트로 넘김
    //props.onMapClick();
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

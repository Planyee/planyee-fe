"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface Location {
  latitude: string;
  longitude: string;
}

interface Recommendation {
  name: string;
  mainCategory: any[];
  subCategory: any[];
  address: any;
  latitude: string;
  longitude: string;
}

interface ArrayType {
  source: Location;
  destination: Location;
  recommendations: Recommendation[];
}

interface MappageProps {
  locations: ArrayType;
  onbuttonclickhandler: () => void;
}

const Map: React.FC<MappageProps> = ({ locations, onbuttonclickhandler }) => {
  const red = "/images/UI_image/redping.png";
  const blue = "/images/UI_image/blueping.png";
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  const mapRef = useRef<HTMLDivElement>(null);
  let map: any, marker: any, marker_p: any;
  let resultInfoArr: any[] = [];
  let resultmarkerArr: any[] = [];
  let drawInfoArr: any[] = [];

  const trans = (locations: ArrayType): string => {
    const startlat: string = locations.source.latitude.toString();
    const startlon: string = locations.source.longitude.toString();
    const endlat: string = locations.destination.latitude.toString();
    const endlon: string = locations.destination.longitude.toString();
    const recommendations = locations.recommendations;

    const viaPoints = recommendations.map((item, index) => ({
      viaPointId: `경유지${index.toString()}`,
      viaPointName: item.name,
      viaX: item.longitude.toString(),
      viaY: item.latitude.toString(),
    }));

    return JSON.stringify({
      startName: "출발지",
      startX: startlon,
      startY: startlat,
      startTime: "202311131003",
      endName: "도착지",
      endX: endlon,
      endY: endlat,
      viaPoints: viaPoints,
    });
  };

  function markerset(lat: any, lon: any, color: any) {
    //@ts-ignore
    marker = new window.Tmapv2.Marker({
      //@ts-ignore
      position: new window.Tmapv2.LatLng(lat, lon),
      icon: color,
      map: map,
    });
    resultmarkerArr.push(marker);
  }

  async function routeLayer(params: any) {
    const url =
      "https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1";
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          appKey: appKey,
        },
        credentials: "include",
        body: params,
      });

      if (!resp.ok) {
        throw new Error(`Error! status: ${resp.status}`);
      }

      const response = await resp.json();
      const resultFeatures = response.features;

      if (resultInfoArr.length > 0) {
        for (let i = 0; i < resultInfoArr.length; i++) {
          resultInfoArr[i].setMap(null);
        }
        resultInfoArr = [];
      }

      for (let i = 0; i < resultFeatures.length; i++) {
        const geometry = resultFeatures[i].geometry;

        let polyline_;

        drawInfoArr = [];

        if (geometry.type == "LineString") {
          for (let j = 0; j < geometry.coordinates.length; j++) {
            //@ts-ignore
            const latlng = new window.Tmapv2.LatLng(
              geometry.coordinates[j][1],
              geometry.coordinates[j][0]
            );

            drawInfoArr.push(latlng);
          }
          //@ts-ignore
          polyline_ = new window.Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: "#ff0000",
            strokeWeight: 6,
            strokeStyle: "solid",
            map: map,
          });
          resultInfoArr.push(polyline_);
        }
      }
      console.log(drawInfoArr + " fetch함수의 drawInfoArr입니다.");
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  async function onstarthandler(locations: ArrayType) {
    const params = await trans(locations);

    await markerset(locations.source.latitude, locations.source.longitude, red);
    await markerset(
      locations.destination.latitude,
      locations.destination.longitude,
      red
    );
    locations.recommendations.map((item) => {
      markerset(item.latitude, item.longitude, blue);
    });
    await routeLayer(params);
  }

  useEffect(() => {
    //@ts-ignore
    if (!map && window.Tmapv2 && mapRef.current) {
      //@ts-ignore
      map = new window.Tmapv2.Map(mapRef.current, {
        //@ts-ignore
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%",
        height: "890px",
        zoom: 14,
      });

      onstarthandler(locations);
    }
  }, []);

  return (
    <>
      <div
        className="relative top-0 z-1 w-full h-screen bg-red-600"
        ref={mapRef}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-center text-white font-bold cursor-pointer"
        onClick={onbuttonclickhandler}
      >
        확인
      </div>
    </>
  );
};

export default Map;

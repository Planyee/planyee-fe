import React, { useEffect, useRef, useState } from "react";
import "./mappage.css";

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

//props의 타입을 정의합니다.
interface MappageProps {
  locations: ArrayType;
  onbuttonclickhandler: () => void;
}

const Mappage: React.FC<MappageProps> = ({
  locations,
  onbuttonclickhandler,
}) => {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  var marker;
  var params;
  var markerArr = [];
  var resultInfoArr = [];
  var drawInfoArr = [];

  const trans = (locations: ArrayType): any => {
    const startlat = locations.source.latitude;
    const startlon = locations.source.longitude;
    const endlat = locations.destination.latitude;
    const endlon = locations.destination.longitude;
    const recommendations = locations.recommendations;
    const viaPoints = recommendations.map((item, index) => ({
      viaPointId: index.toString(),
      viaPointName: item.name,
      viaX: item.longitude,
      viaY: item.latitude,
    }));

    return JSON.stringify({
      startName: "출발지",
      startX: startlat,
      startY: startlon,
      startTime: "202311131053",
      endName: "도착지",
      endX: endlat,
      endY: endlon,
      viaPoints: viaPoints,
    });
  };

  // 나머지 함수들...
  function markerset(lat: any, lon: any) {
    removeMarkers();
    marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lat, lon),
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

  async function routeLayer(params: string) {
    const url =
      "https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          appKey: appKey,
          data: params,
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      var resultData = response.properties;
      var resultFeatures = response.features;

      if (resultInfoArr.length > 0) {
        for (var i in resultInfoArr) {
          resultInfoArr[i].setMap(null);
        }
        resultInfoArr = [];
      }

      for (var i in resultFeatures) {
        var geometry = resultFeatures[i].geometry;
        var properties = resultFeatures[i].properties;
        var polyline_;

        drawInfoArr = [];

        if (geometry.type == "LineString") {
          for (var j in geometry.coordinates) {
            // 경로들의 결과값(구간)들을 포인트 객체로 변환
            var latlng = new window.Tmapv2.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            // 포인트 객체를 받아 좌표값으로 변환
            var convertPoint =
              new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
            // 포인트객체의 정보로 좌표값 변환 객체로 저장
            var convertChange = new window.Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            );
            drawInfoArr.push(convertChange);
          }

          polyline_ = new window.Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: "#DD0000",
            strokeWeight: 6,
            map: map,
          });
          resultInfoArr.push(polyline_);
        } else {
          var markerImg = "";
          var size = ""; //아이콘 크기 설정합니다.

          if (properties.pointType == "S") {
            //출발지 마커
            markerImg =
              "https://developers.skplanetx.com/upload/tmap/marker/pin_r_m_s.png";
            size = new window.Tmapv2.Size(24, 38);
          } else if (properties.pointType == "E") {
            //도착지 마커
            markerImg =
              "https://developers.skplanetx.com/upload/tmap/marker/pin_r_m_e.png";
            size = new window.Tmapv2.Size(24, 38);
          }

          var latlon = new window.Tmapv2.Point(
            geometry.coordinates[0],
            geometry.coordinates[1]
          );
          var convertPoint =
            new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlon);

          marker_p = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            ),
            icon: markerImg,
            iconSize: size,
            map: map,
          });
          resultmarkerArr.push(marker_p);
        }
      }
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  useEffect(() => {
    // 입력받은 locations을 params로 변환

    // 지도 생성 및 관련 로직...
    if (!map && window.Tmapv2 && mapRef.current) {
      const newMap = new window.Tmapv2.Map(mapRef.current, {
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%",
        height: "890px",
        zoom: 18,
      });
      setMap(newMap);

      // 경로 표시 로직...
      params = trans(locations);
      markerset(locations.source.latitude, locations.source.longitude);
      markerset(
        locations.destination.latitude,
        locations.destination.longitude
      );
      routeLayer(params);
    }
  }, [locations]);

  return (
    <div className="mappage">
      <div className="basemap" ref={mapRef}></div>
      <div className="user_input_confirm" onClick={onbuttonclickhandler}>
        확인
      </div>
    </div>
  );
};

export default Mappage;

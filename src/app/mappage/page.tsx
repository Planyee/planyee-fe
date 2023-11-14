import React, { useEffect, useRef, useState } from "react";
import "./mappage.css";

interface Location {
  latitude: any;
  longitude: any;
}

interface Recommendation {
  name: any;
  mainCategory: any[];
  subCategory: any[];
  address: any;
  latitude: any;
  longitude: any;
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
  const mapRef = useRef<HTMLDivElement>(null);
  var map, marker, marker_p;
  var resultInfoArr = [];
  var resultmarkerArr = [];
  var drawInfoArr = [];

  const trans = (locations: any): any => {
    // const startlat = locations.source.latitude;
    // console.log(locations + " locations입니다.");
    const startlat: string = locations.source.latitude.toString();
    // console.log(startlat + " startlat입니다.");
    const startlon: string = locations.source.longitude.toString();
    // console.log(startlon + " startlon입니다.");
    const endlat: string = locations.destination.latitude.toString();
    // console.log(endlat + " endlat입니다.");
    const endlon: string = locations.destination.longitude.toString();
    // console.log(endlon + " endlon입니다.");
    const recommendations = locations.recommendations;

    const viaPoints = recommendations.map((item, index) => ({
      viaPointId: "경유지" + index.toString(),
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

  // 나머지 함수들...
  function markerset(lat: any, lon: any) {
    marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lat, lon),
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
        body: params,
      });

      if (!resp.ok) {
        throw new Error(`Error! status: ${resp.status}`);
      }
      //var resultData = response.properties;
      // console.log(resp + " fetch함수의 resp입니다.");

      var response = await resp.json();
      // console.log(response + " fetch함수의 response입니다.");

      var resultFeatures = response.features;
      // console.log(resultFeatures + " fetch함수의 resultFeatures입니다.");

      if (resultInfoArr.length > 0) {
        for (var i in resultInfoArr) {
          resultInfoArr[i].setMap(null);
        }
        resultInfoArr = [];
      }

      for (var i in resultFeatures) {
        var geometry = resultFeatures[i].geometry;
        // console.log(geometry + " fetch함수의 geometry입니다.");
        var properties = resultFeatures[i].properties;
        // console.log(properties + " fetch함수의 properties입니다.");
        var polyline_;

        drawInfoArr = [];

        if (geometry.type == "LineString") {
          for (var j in geometry.coordinates) {
            // 경로들의 결과값(구간)들을 포인트 객체로 변환 문제가 있던 코드를 대체함
            // var latlng = new window.Tmapv2.Point(
            //   geometry.coordinates[j][1],
            //   geometry.coordinates[j][0]
            // );
            var latlng = new window.Tmapv2.LatLng(
              geometry.coordinates[j][1],
              geometry.coordinates[j][0]
            )

            // // console.log(latlng + " latlng입니다.");
            // // 포인트 객체를 받아 좌표값으로 변환
            // var convertPoint =
            //   new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);

            // // 포인트객체의 정보로 좌표값 변환 객체로 저장
            // var convertChange = new window.Tmapv2.LatLng(
            //   convertPoint._lat,
            //   convertPoint._lng
            // );
            drawInfoArr.push(latlng); //이 과정이 원인인것 같음 LatLng를 하여 얻는 값이 비 정상적임 그래서 기존의 convertChange로 얻는 좌표값 대신 coordinates로 얻는 좌표값을 사용하였음
          }
          polyline_ = new window.Tmapv2.Polyline({// drawInfoArr를 사용하여 polyline을 생성, 생성된 polyline은 resultInfoArr에 저장
            path: drawInfoArr,
            strokeColor: "#ff0000",
            strokeWeight: 6,
            strokeStyle: "solid",
            map: map,
          });
          resultInfoArr.push(polyline_);
          // console.log(resultInfoArr + " fetch함수의 resultInfoArr입니다.");
         } 
        // else { // 마커 생성하는 부분인데 여기 추가하니까 에러가 생겨서 손보는 중
        //   var markerImg = "";
        //   var size = ""; //아이콘 크기 설정합니다.

        //   if (properties.pointType == "S") {
        //     //출발지 마커
        //     markerImg = "/images/UI_image/redping.png"
        //     size = new window.Tmapv2.Size(24, 38);
        //   } else if (properties.pointType == "E") {
        //     //도착지 마커
        //     markerImg = "/images/UI_image/redping.png";
        //     size = new window.Tmapv2.Size(24, 38);
        //   }

        //   // var latlon = new window.Tmapv2.Point(
        //   //   geometry.coordinates[0],
        //   //   geometry.coordinates[1]
        //   // );
        //   // var convertPoint =
        //   //   new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlon);
        //   var latlon = new window.Tmapv2.LatLng(
        //     geometry.coordinates[i][0],
        //     geometry.coordinates[i][1]
        //   );

        //   marker_p = new window.Tmapv2.Marker({
        //     // position: new window.Tmapv2.LatLng(
        //     //   convertPoint._lat,
        //     //   convertPoint._lng
        //     // ),
        //     position:latlon,
        //     icon: markerImg,
        //     iconSize: size,
        //     map: map,
        //   });
        //   resultmarkerArr.push(marker_p);
        //}
      }
      console.log(drawInfoArr + " fetch함수의 drawInfoArr입니다.");
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  async function onstarthandler(locations: ArrayType) {
    // console.log(locations + " fetch함수의 locations입니다.");
    var params = await trans(locations);
    // console.log(params + " fetch함수의 params입니다.");
    // console.log(JSON.stringify(params));
    await markerset(locations.source.latitude, locations.source.longitude);
    await markerset(
      locations.destination.latitude,
      locations.destination.longitude
    );
    await routeLayer(params);
  }

  useEffect(() => {
    // 지도 생성 및 관련 로직...
    if (!map && window.Tmapv2 && mapRef.current) {
      map = new window.Tmapv2.Map(mapRef.current, {
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%",
        height: "890px",
        zoom: 14,
      });
      // 경로 표시 로직...
      // console.log(JSON.stringify(locations, null, 2));
      // console.log(locations + " fetch함수 밖의 locations입니다.");
      onstarthandler(locations);
      //   var polyline = new Tmapv2.Polyline({
      //     path: [new Tmapv2.LatLng(37.566381,126.985123),
      //       new window.Tmapv2.LatLng(37.566581,126.985123),
      //       new window.Tmapv2.LatLng(37.566381,126.985273),
      //       new window.Tmapv2.LatLng(37.566581,126.985423),
      //       new window.Tmapv2.LatLng(37.566381,126.985423)],
      //     strokeColor: "#dd00dd",
      //     strokeWeight: 6,
      //     map: map
      // });
    }
  }, []); //실제로는 locations이 바뀔 때마다 useEffect가 실행됩니다.

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

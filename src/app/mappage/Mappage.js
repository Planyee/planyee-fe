import React, { useEffect } from "react";
import "./mappage.css";
import { json } from "stream/consumers";

export default function Mappage({ locations }, { onbuttonclickhandler }) {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  var map, marker, params;
  var markerArr = [];
  const mapRef = useRef(null);
  var resultInfoArr = [];
  var drawInfoArr = [];

  const trans = (locations) => {
    var startlat = locations.source.latitude;
    var startlon = locations.source.longitude;
    var endlat = locations.destination.latitude;
    var endlon = locations.destination.longitude;
    var recommendations = locations.recommendations;
    var viaPoints = recommendations.map((item, index) => ({
      viaPointId: index,
      viaPointName: item.name,
      viaX: item.longitude,
      viaY: item.latitude,
    }));
    return (params = JSON.stringify({
      startName: "출발지",
      startX: startlat,
      startY: startlon,
      startTime: "201708081103",
      endName: "도착지",
      endX: endlat,
      endY: endlon,
      viaPoints: viaPoints,
    }));
  };

  function removeline() {
    if (resultInfoArr.length > 0) {
      for (var i in resultInfoArr) {
        resultInfoArr[i].setMap(null);
      }
      resultInfoArr = [];
    }
  }

  function drawline(routes) {
    for (var i in routes) {
      var geometry = routes[i].geometry;
      var properties = routes[i].properties;
      var polyline_;
      drawInfoArr = [];

      if (geometry.type == "LineString") {
        for (var j in geometry.coordinates) {
          var latlng = new window.Tmapv2.LatLng(
            geometry.coordinates[j][1],
            geometry.coordinates[j][0]
          );
          var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
            latlng
          );
          var convertChange = new Tmapv2.LatLng(
            convertPoint._lat,
            convertPoint._lng
          );
          drawInfoArr.push(convertChange);
        }

        polyline_ = new Tmapv2.Polyline({
          path: drawInfoArr,
          strokeColor: "#FF0000",
          strokeWeight: 6,
          map: map,
        });
        resultInfoArr.push(polyline_);
      } else {
        var markerImg = "";
        var size = ""; //아이콘 크기 설정합니다.

        if (properties.pointType == "S") {
          //출발지 마커
          markerImg = "/upload/tmap/marker/pin_r_m_s.png";
          size = new Tmapv2.Size(24, 38);
        } else if (properties.pointType == "E") {
          //도착지 마커
          markerImg = "/upload/tmap/marker/pin_r_m_e.png";
          size = new Tmapv2.Size(24, 38);
        } else {
          //각 포인트 마커
          markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
          size = new Tmapv2.Size(8, 8);
        }

        // 경로들의 결과값들을 포인트 객체로 변환
        var latlon = new Tmapv2.Point(
          geometry.coordinates[0],
          geometry.coordinates[1]
        );
        // 포인트 객체를 받아 좌표값으로 다시 변환
        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
          latlon
        );

        marker_p = new Tmapv2.Marker({
          position: new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng),
          icon: markerImg,
          iconSize: size,
          map: map,
        });

        resultMarkerArr.push(marker_p);
      }
    }
  }
  function removeMarkers() {
    for (var i = 0; i < markerArr.length; i++) {
      markerArr[i].setMap(null);
    }
    markerArr = [];
  }

  function markerset(lat, lon) {
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();
    //Marker 객체 생성.
    marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lat, lon), //Marker의 중심좌표 설정.
      map: map, //Marker가 표시될 Map 설정.
    });
    markerArr.push(marker);
  }
  // 다중경로안내
  async function routeLayer(locations) {
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

      const data = await response.json();
      const routes = data.features.map(
        (feature) => feature.geometry.coordinates
      );

      return routes;
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  }

  useEffect(() => {
    // 입력받은 locations을 params로 변환
    var params = trans(locations);

    //초기에 지도를 생성하고 터치시 발생하는 이벤트 리스너를 설정
    if (!map && window.Tmapv2 && mapRef.current) {
      map = new window.Tmapv2.Map(mapRef.current, {
        // 지도가 생성될 div
        center: new window.Tmapv2.LatLng(37.5652045, 126.98702028),
        width: "100%", // 지도의 넓이
        height: "890px", // 지도의 높이
        zoom: 18,
      });

      //출발지 도착지에 마커생성
      markerset(
        locations.source.latitude, 
        locations.source.longitude
        );
      markerset(
        locations.destination.latitude,
        locations.destination.longitude
      );
      
      routeLayer(locations).then((routes) => {
        console.log(routes);
      });
    }
  }, []);//실제로는 locations이 바뀔때마다 실행되어야함

  return (
    <div className="mappage">
      <div className="basemap" ref={mapRef}></div>
      <div className="user_input_confirm" onClick={onbuttonclickhandler}>
        확인
      </div>
    </div>
  );
}

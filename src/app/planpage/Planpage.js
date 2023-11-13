'use client';

import React, { useState } from "react";
import Map from "../input/Inputpage";
import './planpage.css';

function Planpage(props) {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";
  //서버 전송용 좌표
  const [coordinate, setCoordinate] = useState({
  sourceLatitude: "",
  sourceLongitude: "",
  destinationLatitude: "",
  destinationLongitude: "",
  });

  //표시용 좌표
  const [translatedCoordinate, setTranslatecoordinate] = useState({
    departure: "",
    destination: "",
  });

  //클릭된 것이 출발지인지 도착지인지 나타냄
  const [whatclicked, setWhatclicked] = useState("");

  //클릭하였다면 map을 출력할 수 있도록
  const [inputclicked, setInputclicked] = useState(false);

  const departureclickhandler = () => {
    setInputclicked(true);
    setWhatclicked("departure");
  };

  const destinationclickhandler = () => {
    setInputclicked(true);
    setWhatclicked("destination");
  };

  const mapclickhandler = () => {
    setInputclicked(false);
  };

  const getvalue = async (address, lat, lon) => {
    if (whatclicked === "departure") {
      console.log("departure값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
           ...prevState,
          // departure: address,
          sourceLatitude: lat,
          sourceLongitude: lon,
        };
      });
      
      setTranslatecoordinate((prevState) => {
        return {
           ...prevState,
          // sourceLatitude: lat,
          // sourceLongitude: lon,
          departure: address,
        }
      })
    } else if (whatclicked === "destination") {
      console.log("destination값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
           ...prevState,
          // destination: address,
          destinationLatitude: lat,
          destinationLongitude: lon,
        };
      });
      
      setTranslatecoordinate((prevState) => {
        return {
           ...prevState,
          // destinationLatitude: lat,
          // destinationLongitude: lon,
          destination: address,
        }
      })
    }
  };
  return inputclicked ? (
    <Map clickstate={whatclicked} propsfunction={getvalue} onMapClick={mapclickhandler} />
  ) : (
    <div>
        <div>
          <label>출발지: </label>
          <input className="input_form1"
            value={
              translatedCoordinate.departure
                ? translatedCoordinate.departure
                : "입력하세요"
            }
            readOnly
            onTouchEnd={departureclickhandler}
          />
        </div>
        <div>
          <label>도착지: </label>
          <input 
            value={
              translatedCoordinate.destination
                ? translatedCoordinate.destination
                : "입력하세요"
            }
            readOnly
            onTouchEnd={destinationclickhandler}
          />
        </div>
    </div>
  );
}

export default Planpage;

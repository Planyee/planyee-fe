'use client';
import React, { useState } from "react";
import Inputpage from "@/app/inputpage/Inputpage";

// Props 타입 정의, 필요에 따라 수정 가능
interface PlanpageProps {
  // 여기에 필요한 props 타입을 정의하세요
}

// 좌표 상태를 위한 인터페이스 정의
interface Coordinate {
  sourceLatitude: string;
  sourceLongitude: string;
  destinationLatitude: string;
  destinationLongitude: string;
}

// 번역된 좌표 상태를 위한 인터페이스 정의
interface TranslatedCoordinate {
  departure: string;
  destination: string;
}

const Planpage: React.FC<PlanpageProps> = (props) => {
  const appKey = "jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg";

  const [coordinate, setCoordinate] = useState<Coordinate>({
    sourceLatitude: "",
    sourceLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
  });

  const [translatedCoordinate, setTranslatecoordinate] = useState<TranslatedCoordinate>({
    departure: "",
    destination: "",
  });

  const [whatclicked, setWhatclicked] = useState<string>("");
  const [inputclicked, setInputclicked] = useState<boolean>(false);

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

  const getvalue = async (address: string, lat: string, lon: string) => {
    if (whatclicked === "departure") {
      console.log("departure값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
          ...prevState,
          sourceLatitude: lat,
          sourceLongitude: lon,
        };
      });
      
      setTranslatecoordinate((prevState) => {
        return {
          ...prevState,
          departure: address,
        };
      });
    } else if (whatclicked === "destination") {
      console.log("destination값을 정의할 getvalue함수 호출됨");
      setCoordinate((prevState) => {
        return {
          ...prevState,
          destinationLatitude: lat,
          destinationLongitude: lon,
        };
      });
      
      setTranslatecoordinate((prevState) => {
        return {
          ...prevState,
          destination: address,
        };
      });
    }
  };

  return inputclicked ? (
    <Inputpage clickstate={whatclicked} propsfunction={getvalue} onMapClick={mapclickhandler} />
  ) : (
    <div>
      <div>
        <label>출발지: </label>
        <input className="input_form1"
          value={translatedCoordinate.departure || "입력하세요"}
          readOnly
          onTouchEnd={departureclickhandler}
        />
      </div>
      <div>
        <label>도착지: </label>
        <input 
          value={translatedCoordinate.destination || "입력하세요"}
          readOnly
          onTouchEnd={destinationclickhandler}
        />
      </div>
    </div>
  );
}

export default Planpage;
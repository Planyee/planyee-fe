"use client";
import { atom } from "recoil";

export const selectedDateState = atom({
  key: "selectedDateState",
  default: { year: 0, month: 0, day: 0 },
});

// 출발지 (위도 , 경도)
export const srcLocationState = atom({
  key: "srcLocationState",
  default: { latitude: null, longitude: null },
});

// 도착지 (위도, 경도)
export const destLocationState = atom({
  key: "destLocationState",
  default: { latitude: null, longitude: null },
});

// 입력받은 위도 경도 -> 번역
export const translatedLocationState = atom({
  key: "translatedLocationState",
  default: { source: null, destination: null },
});

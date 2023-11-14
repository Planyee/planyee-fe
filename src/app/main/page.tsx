"use client";
import { Group, Stack } from "@mantine/core";
import Link from "next/link";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useSetRecoilState } from "recoil";
import Calendar from "@/components/Calendar";
import { selectedDateState } from "@/state/states";
import { useEffect, useState } from "react";

interface Plan {
  planId: number;
  planName: string;
  date: string;
}

export default function Main() {
  const setSelectedDate = useSetRecoilState(selectedDateState);
  const [plans, setPlans] = useState<Plan[]>([]);

  const handleSelectDate = (selectedDate: {
    year: number;
    month: number;
    day: number;
  }) => {
    setSelectedDate(selectedDate);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://43.202.89.97:52458/main");
        if (!response.ok) {
          throw new Error(
            `API 호출이 실패하였습니다. 상태 코드: ${response.status}`
          );
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("일정 정보 받아오기 실패", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <div className="h-screen relative flex flex-col gap-10 items-center w-full">
        <Calendar onSelectDate={handleSelectDate} />

        <Stack className="flex flex-col gap-4">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className="bg-[#E3F0F4] w-full h-12 rounded-xl"
            >
              <Group className="flex justify-between items-center h-full px-4">
                <p>{plan.date}</p>
                <p>|</p>
                <p>{plan.planName}</p>
              </Group>
            </div>
          ))}
        </Stack>

        <div className="absolute bottom-5 w-full">
          <Link href="/plan">
            <button className="bg-[#2C7488] text-white w-full h-10">
              일정 등록
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

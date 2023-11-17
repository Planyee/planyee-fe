"use client";
// Fix
import { Group, Stack } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useSetRecoilState } from "recoil";
import Calendar from "@/components/Calendar";
import { selectedDateState, planId } from "@/state/states";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Plan {
  planId: number;
  planName: string;
  date: string;
}

export default function Main() {
  const setSelectedDate = useSetRecoilState(selectedDateState);
  const [plans, setPlans] = useState<Plan[]>([]);
  const setPlanId = useSetRecoilState(planId); // planId 상태를 설정하는 함수를 가져옵니다.
  const router = useRouter();

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
        const response = await fetch("http://43.202.89.97:52458/main", {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(
            `API 호출이 실패하였습니다. 상태 코드: ${response.status}`
          );
        }
        const data: Plan[] = await response.json();

        // 문자열 형식으로 제공된 날짜를 Date 객체로 변환하여 정렬
        const sortedData = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setPlans(data);
      } catch (error) {
        console.error("일정 정보 받아오기 실패", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <div className="h-screen relative">
        <p className="text-2xl text-center font-semibold mt-2">일정 확인</p>

        <Stack className="flex flex-col gap-10 items-center w-full">
          <Calendar onSelectDate={handleSelectDate} />

          <div className="overflow-y-auto h-[calc(100% - 5rem)] mt-2 pb-20">
            <Stack className="flex flex-col gap-4">
              {plans.map((plan) => (
                <button
                  key={plan.planId}
                  className="bg-[#E3F0F4] w-full h-12 rounded-xl"
                  onClick={() => {
                    setPlanId(plan.planId);
                    router.push(`/list`);
                  }}
                >
                  <Group className="flex justify-between items-center h-full px-4">
                    <p>{plan.date}</p>
                    <Image
                      src="/images/line.svg"
                      alt="Logo"
                      width={0.5}
                      height={1}
                    />
                    <p>{plan.planName}</p>
                  </Group>
                </button>
              ))}
            </Stack>
            <Stack className="flex flex-col gap-4">
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
              <div>예시</div>
            </Stack>
          </div>

          <div className="fixed bottom-0 left-0 w-full">
            {/* 'fixed' 속성을 사용하여 화면 하단에 고정 */}
            <Link href="/plan">
              <button className="bg-[#2C7488] text-white w-full h-16">
                일정 등록
              </button>
            </Link>
          </div>
        </Stack>
      </div>
    </>
  );
}

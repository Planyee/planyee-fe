"use client";
import Link from "next/link";

export default function Plan() {
  return (
    <>
      <div className="h-screen relative">
        {/* 지도가 출력될 부분 */}

        <div className="absolute bottom-5 w-full">
          <Link href="/day">
            <button className="bg-[#CB475B] text-white w-full h-10">
              확인
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

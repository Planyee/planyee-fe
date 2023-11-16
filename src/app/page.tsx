"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleNaverLogin = () => {
    // 네이버 로그인 인증 요청
    window.location.href =
      "http://43.202.89.97:52458/oauth2/authorization/naver";
  };

  return (
    <>
      <div className="h-screen relative bg-[#CB475B] flex flex-col items-center justify-center">
        <Image src="/images/logo.svg" alt="Logo" width={25} height={25} />
        <Image
          src="/images/planyee.svg"
          alt="Planyee"
          width={150}
          height={150}
        />

        <div className="absolute bottom-0 mb-20">
          <button onClick={handleNaverLogin}>
            <Image
              src="/images/naverBtn.png"
              alt="Naver Login"
              width={170}
              height={40}
            />
          </button>
        </div>
      </div>
    </>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { Stack } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Select() {
  const [imageUrls, setImageUrls] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const router = useRouter();

  const handleImageClick = (imageData: any) => {
    // 이미지가 이미 선택되었다면 선택 해제하고, 그렇지 않다면 선택
    if (selectedImages.find((image) => image === imageData.name)) {
      // 'image'는 이미지의 이름입니다.
      setSelectedImages(
        selectedImages.filter((image) => image !== imageData.name)
      );
    } else {
      setSelectedImages([...selectedImages, imageData.name]); // 'imageData.name' 추가
    }
  };

  const handleImageSelection = async () => {
    // 이미지 선택 확인 후, 다음 페이지로 이동
    try {
      const response = await fetch("http://43.202.89.97:52458/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedImages), // 이미지의 장소명 배열을 JSON 문자열로 변환
      });

      if (!response.ok) {
        throw new Error(
          `API 호출이 실패하였습니다. 상태 코드: ${response.status}`
        );
      }

      router.push("/main");
    } catch (error) {
      console.error("이미지 정보 전송 실패", error);
    }
  };

  useEffect(() => {
    const fetchImagesFromBackend = async () => {
      try {
        const response = await fetch("http://43.202.89.97:52458/select");
        if (!response.ok) {
          throw new Error(
            `API 호출이 실패하였습니다. 상태 코드: ${response.status}`
          );
        }
        const data = await response.json();
        setImageUrls(data);
      } catch (error) {
        console.error("이미지 가져오기 실패", error);
      }
    };

    fetchImagesFromBackend();
  }, []);

  return (
    <div className="h-screen relative flex flex-col items-center w-full">
      <div className="overflow-y-auto h-[calc(100%-5rem)] mt-12 pb-10">
        <Stack className="gap-10">
          <p className="text-2xl font-medium">선호하는 장소를 선택해주세요</p>
          <div className="grid grid-cols-2 gap-4">
            {imageUrls &&
              imageUrls.map((imageData, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(imageData)}
                  style={{ position: "relative", aspectRatio: "1" }}
                  className={`border-4 ${
                    selectedImages.includes(imageData.name) // 'selectedImages.includes(imageData.name)'을 사용하여 이미지가 선택되었는지 확인합니다.
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={imageData.imageUrl}
                    alt="이미지"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
          </div>
        </Stack>
      </div>

      <div className="absolute bottom-5 w-full">
        <button
          className="bg-[#CB475B] text-white w-full h-10"
          onClick={handleImageSelection}
        >
          확인
        </button>
      </div>
    </div>
  );
}
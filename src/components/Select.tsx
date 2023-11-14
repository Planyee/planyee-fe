import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageData {
  name: string;
  imageUrl: string;
}

export default function Select({ onClose }: any) {
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const router = useRouter();

  const handleImageClick = (imageData: ImageData) => {
    // 이미지가 이미 선택되었다면 선택 해제하고, 그렇지 않다면 선택
    if (selectedImages.includes(imageData.name)) {
      setSelectedImages((prevSelected) =>
        prevSelected.filter((image) => image !== imageData.name)
      );
    } else {
      setSelectedImages((prevSelected) => [...prevSelected, imageData.name]);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
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
        console.error("이미지 정보 가져오기 실패", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* 이미지를 보여주는 코드 */}
            <div className="grid grid-cols-2 gap-4">
              {imageUrls.map((imageData, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(imageData)}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    border: `4px solid ${
                      selectedImages.includes(imageData.name)
                        ? "blue" // 선택된 이미지의 테두리 색상
                        : "transparent" // 선택되지 않은 이미지의 테두리 색상
                    }`,
                  }}
                >
                  <img
                    src={imageData.imageUrl}
                    alt={imageData.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <p>{imageData.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useRouter } from "next/router";
import { useState } from "react";

import { Text, Button, Rating, Textarea } from "@/components";
import { SeatSelect } from "./SeatSelect";
import { ImagePreview } from "./ImagePreview";
import { ImageUploadButton } from "./ImageUploadButton";
import { ConfirmModal } from "./ConfirmModal";
import { useImageList } from "../../hooks/useImageList";

type ReviewFormProps<T extends React.ElementType> = Component<T> & {
  data?: ReviewDetail;
  onMutate: ({
    theaterId,
    reviewId,
    payload,
  }: {
    theaterId: string;
    reviewId: string;
    payload: FormData;
  }) => void;
};

export function ReviewForm({
  data,
  onMutate,
  children,
  ...props
}: ReviewFormProps<"form">) {
  const {
    query: { theater, reviewId },
  } = useRouter();

  const {
    floor,
    section,
    seatRow,
    seatNumber,
    rating: _rating,
    content,
    images,
  } = data ?? {};

  const isEditMode = !!data;

  const [seat, setSeat] = useState({
    floor: floor ?? "1",
    section: section ?? "OP",
    seatRow: seatRow ?? "1",
    seatNumber: seatNumber ?? "1",
  });
  const [rating, setRating] = useState(_rating ?? 0);
  const [detailReview, setDetailReview] = useState(content ?? "");
  const [showModal, setShowModal] = useState(false);

  const { imageList, deletedImageList, onImageListChange, onImageDelete } =
    useImageList({
      initialImageList: images?.map((image) => ({
        id: Symbol(),
        imagePreviewUrl: image,
      })),
    });

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleFormSubmit = () => {
    const { floor, section, seatRow, seatNumber } = seat;
    const data = {
      floor,
      section,
      seatRow,
      seatNumber,
      rating,
      content: detailReview,
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    imageList.forEach(({ file }) => {
      file && formData.append("image", file);
    });
    deletedImageList.forEach((image) => {
      formData.append("deleteImages", image);
    });

    onMutate({
      theaterId: theater as string,
      reviewId: reviewId as string,
      payload: formData,
    });
  };

  const isValidForm = !!detailReview && rating > 0;

  return (
    <form className="flex flex-col gap-2" {...props}>
      <Text as="h5" className="font-semibold">
        앉았던 자리 선택하기*
      </Text>
      <SeatSelect disabled={isEditMode} seat={seat} setSeat={setSeat} />

      <Text as="h5" className="font-semibold">
        자리가 어떠셨나요?*
      </Text>
      <Rating
        value={rating}
        onRatingChange={handleRatingChange}
        className="mb-4"
      />

      <Text as="h5" className="font-semibold">
        자세한 후기를 알려주세요*
      </Text>
      <Text>리뷰 내용을 1~200자로 입력해주세요.</Text>
      <Textarea
        required
        value={detailReview}
        onChange={(e) => setDetailReview(e.target.value)}
        placeholder={`
        1. 시야는 어땠나요?
        2. 음향은 어땠나요?
        3. 단차는 어땠나요?`}
        cols={30}
        rows={10}
        maxLength={200}
        className="mb-4"
      />

      <Text as="h5" className="font-semibold">
        시야 사진을 등록해주세요
      </Text>
      <div className="flex flex-wrap gap-5">
        <ImageUploadButton onChange={onImageListChange} />
        {imageList.map((image) => (
          <ImagePreview
            key={image.imagePreviewUrl}
            imagePreviewUrl={image.imagePreviewUrl}
            onDelete={() => onImageDelete(image.id)}
          />
        ))}
      </div>
      <Button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={!isValidForm}
      >
        {isValidForm ? "후기 작성하기" : "필수 요소를 채워주세요"}
      </Button>
      {showModal && (
        <ConfirmModal
          showModal={showModal}
          setShowModal={setShowModal}
          seat={{ ...seat }}
          SubmitButton={
            <Button onClick={handleFormSubmit}>후기 공유하기</Button>
          }
        />
      )}
    </form>
  );
}

import { Button, Modal, ModalBody, ModalContent, ModalFooter } from "@nextui-org/react";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
  imgSrc: string;
  aspectRatio?: number;
  onUpload: (base64: string) => void;
};

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspectRatio: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspectRatio, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropperModal({
  isModalOpen,
  onModalClose,
  imgSrc,
  aspectRatio,
  onUpload,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function handleChange(_: unknown, percentCrop: Crop) {
    setCrop(percentCrop);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      const newCrop = centerAspectCrop(width, height, aspectRatio);
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }

  async function handleUpload() {
    const image = imgRef.current!;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    if (!image || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    (ctx as any).drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const blob = await (offscreen as any).convertToBlob({
      type: "image/png",
    });

    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      onUpload(reader.result as string);
    };
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      isDismissable={false}
      isKeyboardDismissDisabled
      placement="top-center"
      scrollBehavior="outside"
      size="xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalBody>
              <div className="p-6">
                <ReactCrop
                  crop={crop}
                  onChange={handleChange}
                  onComplete={setCompletedCrop}
                  aspect={aspectRatio}
                  minHeight={50}
                >
                  <img ref={imgRef} alt="Crop" src={imgSrc} onLoad={handleImageLoad} />
                </ReactCrop>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" fullWidth onPress={onModalClose}>
                Close
              </Button>
              <Button color="primary" fullWidth onPress={handleUpload}>
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

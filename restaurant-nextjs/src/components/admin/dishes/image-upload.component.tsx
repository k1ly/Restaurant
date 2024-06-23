import styles from "@/styles/admin.module.sass";
import clsx from "classnames";
import { ChangeEvent, DragEventHandler, useState } from "react";
import { CloseButton, Form, Image } from "react-bootstrap";

export interface ImageUploadComponentProps {
    imageUrl: string;
    setImage: (image: File) => void;
}

export function ImageUploadComponent({
    imageUrl,
    setImage,
}: ImageUploadComponentProps) {
    const [url, setUrl] = useState<string>(imageUrl);
    const [drag, setDrag] = useState(false);
    const resetFormData = () => {
        setUrl("");
        setImage(null);
    };
    const handleImageDrag: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDrag(true);
        if (e.type === "dragleave") setDrag(false);
    };
    const handleImageDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const image = e.dataTransfer.files[0];
        if (image) {
            e.stopPropagation();
            setDrag(false);
            const accept = ["image/jpeg", "image/jpg", "image/png"];
            if (accept.includes(image.type)) handleImageUpload(image);
        }
    };
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files[0];
        if (image) handleImageUpload(image);
    };
    const handleImageUpload = (image: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(image);
            setUrl(reader.result as string);
        };
        reader.readAsDataURL(image);
    };
    return (
        <div>
            <div className={"d-flex justify-content-center p-3"}>
                <div
                    className={clsx(styles["dish-image-container"], {
                        [styles["drag"]]: drag,
                    })}
                    onDragEnter={handleImageDrag}
                    onDragLeave={handleImageDrag}
                    onDragOver={handleImageDrag}
                    onDrop={handleImageDrop}
                >
                    {url ? (
                        <Image
                            className={"img-thumbnail w-100 h-100"}
                            src={url}
                            alt={"200x200"}
                        />
                    ) : (
                        <span>Перетащите изображение сюда</span>
                    )}
                </div>
                <CloseButton onClick={resetFormData}></CloseButton>
            </div>
            <Form.Control
                type={"file"}
                accept={"image/jpg, image/jpeg, image/png"}
                onChange={handleImageChange}
            />
        </div>
    );
}

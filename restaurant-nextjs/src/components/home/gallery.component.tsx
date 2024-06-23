import { useState } from "react";
import { Carousel, Image } from "react-bootstrap";
import styles from "@/styles/home.module.sass";

export function GalleryComponent() {
    const [index, setIndex] = useState(0);
    return (
        <div className={"d-flex justify-content-center mb-4"}>
            <div className={"w-75"}>
                <Carousel activeIndex={index} onSelect={setIndex}>
                    <Carousel.Item>
                        <Image
                            src={"/img/gallery1.jpg"}
                            alt={"Первый слайд"}
                            className={"d-block w-100"}
                        />
                        <Carousel.Caption
                            className={styles["gallery-item-caption"]}
                        >
                            <div className={styles["gallery-item-title"]}>
                                Хороший вид
                            </div>
                            <div className={styles["gallery-item-text"]}>
                                Ресторан располагается в самом красивом месте!
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            src={"/img/gallery2.jpg"}
                            alt={"Второй слайд"}
                            className={"d-block w-100"}
                        />
                        <Carousel.Caption
                            className={styles["gallery-item-caption"]}
                        >
                            <div className={styles["gallery-item-title"]}>
                                Чистота и порядок
                            </div>
                            <div className={styles["gallery-item-text"]}>
                                Мы сделаем все, чтобы вы чувствовали себя как
                                дома или даже лучше...
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            src={"/img/gallery3.jpg"}
                            alt={"Третий слайд"}
                            className={"d-block w-100"}
                        />
                        <Carousel.Caption
                            className={styles["gallery-item-caption"]}
                        >
                            <div className={styles["gallery-item-title"]}>
                                Кухня Шефа
                            </div>
                            <div className={styles["gallery-item-text"]}>
                                Професионалы своего дела приготовят для вас свои
                                деликатесы...
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            src={"/img/gallery4.jpg"}
                            alt={"Четвертый слайд"}
                            className={"d-block w-100"}
                        />
                        <Carousel.Caption
                            className={styles["gallery-item-caption"]}
                        >
                            <div className={styles["gallery-item-text"]}>
                                Разнообразное меню для которого используются
                                только продукты высшего качества!
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
}

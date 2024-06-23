import { UserDto } from "@/common/dto/users/user.dto";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { GalleryComponent } from "@/components/home/gallery.component";
import { ReviewListComponent } from "@/components/home/review-list.component";
import { Button } from "@/components/page/button.component";
import { PageComponent } from "@/components/page/page.component";
import styles from "@/styles/home.module.sass";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

export default function Home() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            setAuth(authData);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        authenticate();
    }, []);
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Home</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <div className={"d-flex flex-column flex-fill"}>
                    <div className={styles["info-container"]}>
                        <div className={styles["info-about"]}>
                            <div className={"my-3 fs-3"}>
                                Место, куда захочется вернуться!
                            </div>
                            <div className={"fs-5 lh-lg"}>
                                Добро пожаловать в наш уникальный ресторан!
                                Откройте для себя настоящий кулинарный рай в
                                самом сердце города. Наш ресторан предлагает
                                великолепное сочетание изысканного дизайна,
                                домашнего уюта и захватывающих видов на
                                городскую панораму, делая каждый ваш визит
                                незабываемым. Легкость бронирования столиков
                                через наш сайт позволит вам сэкономить время и
                                удобно спланировать ваш вечер. Наш персонал
                                состоит из команды профессионалов, готовых
                                помочь сделать ваш вечер особенным, от
                                внимательного обслуживания до индивидуальных
                                рекомендаций. Приходите к нам, чтобы насладиться
                                не только вкусом, но и красотой момента.
                            </div>
                        </div>
                    </div>
                    <div className={styles["info-showcase"]}>
                        <Image
                            src={"/img/picture.jpg"}
                            className={styles["info-dish"]}
                        />
                        <div className={styles["info-menu"]}>
                            <div className={"my-5 fs-3"}>
                                Каждый найдет что-нибудь свое...
                            </div>
                            <div className={"fs-5 lh-base"}>
                                Что же такого особенного у нас в меню? Все блюда
                                приговлены лучшими поварами проффесионалами!
                                Только свежые продукты попадают к нам на кухню,
                                здесь вы можете отведать ваши любимые блюда или
                                попробовать что-нибудь новенькое. Нет
                                необходимости в чем-то себе отказывать,
                                доступные цены не оставят никого равнодушным, а
                                если вы любите покушать дома с друзьями или в
                                кругу семьи, наша доставка поможет вам с этим!
                            </div>
                            <Link href={"/menu"}>
                                <Button
                                    variant={"dark"}
                                    size={"lg"}
                                    className={"m-4 float-end rounded-pill"}
                                >
                                    Перейти в меню
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className={styles["info-container"]}>
                        <div className={styles["info-extra"]}>
                            <div className={"fs-4 lh-base"}>
                                Нам очень важна ваша оценка, поэтому оставляйте
                                свои отзывы и не забывайте писать на почту либо
                                звонить по номеру, если возникнут какие-либо
                                вопросы или пожелания по улучшению нашего
                                сервиса. Благодарим, что посетили наш ресторан,
                                обязательно приходите еще!
                            </div>
                        </div>
                    </div>
                    <GalleryComponent />
                    <ReviewListComponent setError={setError} auth={auth} />
                </div>
            </PageComponent>
        </ErrorHandlerComponent>
    );
}

import { UserDto } from "@/common/dto/users/user.dto";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { FooterComponent } from "@/components/page/footer.component";
import { HeaderComponent } from "@/components/page/header.component";
import styles from "@/styles/page.module.sass";
import clsx from "classnames";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

export interface PageComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    children: React.ReactNode;
}

export function PageComponent({
    setError,
    auth,
    children,
}: PageComponentProps) {
    const [scrollOffset, setScroll] = useState(0);
    const [offset, setOffset] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const handleScroll = () => setScroll(scrollY);
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, [scrollOffset]);
    return (
        <div className={styles["page-container"]}>
            <HeaderComponent
                setError={setError}
                auth={auth}
                scrollOffset={scrollOffset}
                headerHeight={headerHeight}
                setHeaderHeight={setHeaderHeight}
            />
            <div
                className={"d-flex align-items-center flex-column flex-fill"}
                style={{ paddingTop: headerHeight }}
            >
                <div className={styles["content"]}>{auth && children}</div>
            </div>
            <div
                className={clsx(styles["scroll"], {
                    invisible: !scrollOffset || scrollOffset <= footerHeight,
                    "opacity-0": !scrollOffset || scrollOffset <= footerHeight,
                    "position-fixed": !(
                        scrollOffset >= offset - windowHeight &&
                        scrollOffset + footerHeight <= offset
                    ),
                    [styles["scroll-footer"]]:
                        scrollOffset >= offset - windowHeight &&
                        scrollOffset + footerHeight <= offset,
                })}
                style={{
                    top:
                        scrollOffset >= offset - windowHeight &&
                        scrollOffset + footerHeight <= offset
                            ? offset - 60 - 30
                            : undefined,
                }}
                onClick={() => scroll({ top: 0, behavior: "smooth" })}
            >
                <Image src={"/img/icon/up.svg"} />
            </div>
            <FooterComponent
                scrollOffset={scrollOffset}
                setOffset={setOffset}
                setFooterHeight={setFooterHeight}
            />
        </div>
    );
}

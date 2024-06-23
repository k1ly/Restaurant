import styles from "@/styles/page.module.sass";
import { createRef, useEffect } from "react";

export interface FooterComponentProps {
    scrollOffset: number;
    setOffset: (offset: number) => void;
    setFooterHeight: (footerHeight: number) => void;
}

export function FooterComponent({
    scrollOffset,
    setOffset,
    setFooterHeight,
}: FooterComponentProps) {
    const footer = createRef<HTMLElement>();
    useEffect(() => {
        setOffset(footer.current.offsetTop);
        setFooterHeight(footer.current.clientHeight);
    }, [scrollOffset]);
    return (
        <footer ref={footer} className={styles["footer"]}>
            <div>©2024 KIRILL LYSKOV. RESTAURANT WEB PROJECT</div>
        </footer>
    );
}

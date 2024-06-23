import { Button } from "@/components/page/button.component";
import { Form, Image, InputGroup } from "react-bootstrap";

export interface SearchComponentProps {
    search: string;
    setSearch: (search: string) => void;
    submit: () => void;
}

export function SearchComponent({
    search,
    setSearch,
    submit,
}: SearchComponentProps) {
    return (
        <div className={"d-flex justify-content-center my-2"}>
            <InputGroup className={"rounded-pill w-25"}>
                <Form.Control
                    type={"search"}
                    placeholder={"Введите запрос..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant={"primary"} onClick={submit}>
                    <Image src={"/img/icon/search.svg"} />
                </Button>
            </InputGroup>
        </div>
    );
}

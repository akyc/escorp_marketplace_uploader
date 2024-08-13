import { Button } from "react-bootstrap";
import { useState } from "react";

export const LinkRow = ({ info }) => {
    let [filename, image_url, thumb_url, date] = info;
    const [isCopy, setIsCopy] = useState(false);

    const Icon = () => {
        if (isCopy) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-lg"
                    viewBox="0 0 16 16"
                >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"></path>
                </svg>
            );
        } else {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clipboard"
                    viewBox="0 0 16 16"
                >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"></path>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"></path>
                </svg>
            );
        }
    };
    const clickHandler = () => {
        navigator.clipboard.writeText(image_url).then(() => {
            setIsCopy(true);
            setTimeout(() => {
                setIsCopy(false);
            }, 2000);
        });
    };
    return (
        <tr>
            <td>
                <img src={thumb_url} alt="" width="100" />
            </td>
            <td>{new Date(date).toLocaleString('ru-RU')}</td>
            <td>{filename}</td>
            <td>{image_url}</td>
            <td>
                <Button variant="light" size="sm" onClick={clickHandler}><Icon /></Button>
            </td>
        </tr>
    );
};

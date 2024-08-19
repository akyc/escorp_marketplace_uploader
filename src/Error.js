import { Alert } from "react-bootstrap"

export const Error = ({ errors }) => {
    return (
        <Alert variant="danger">
            <p>Ошибка при загрузке следующих файлов:</p>
            <ul>
                {errors.map((error, i) => {
                    return (<li key={i}><b>{error.file.name}</b><br /><small>{error.info.error.message}</small></li>)
                })}
            </ul>
        </Alert>
    )
}
import { useEffect, useState } from "react";
import { API } from "./utils/Api";
import { LinksTable } from "./LinksTable";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

function App() {
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [loadingUploding, setLoadingUploading] = useState(false);
  const [hasError, serHasError] = useState(false);
  const [links, setLinks] = useState();

  let errors = [];

  function handleSubmit(e) {
    e.preventDefaul();
    const form = e.currentTarget;
  }

  useEffect(() => {
    API.getUploadedInfo().then((data) => {
      setLinks(data);
      setLoadingGoogle(false);
    });
  }, []);

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="6" className="py-5">
            <Form className="p-5 bg-body-tertiary" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicFiles">
                <Form.Control
                  type="file"
                  placeholder="Выберите файлы"
                  multiple
                />
                <Form.Text className="text-muted">
                  Файлы для маркетлейсов только в формате .jpg и .png
                </Form.Text>
              </Form.Group>
              {loadingUploding ? (
                <Button variant="primary" type="submit" disabled>
                  <Spinner
                    animation="border"
                    role="status"
                    size="sm"
                    as="span"
                  ></Spinner>{" "}
                  Загрузка...
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Загрузить
                </Button>
              )}
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="6" className="py-3">
            {hasError && (
              <Alert variant="danger">
                Произошла ошибка при загрузке: {errors.join(",")}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-md-center">
          {loadingGoogle && (
            <Col md="10" className="text-center">
              <Spinner animation="border" role="status" className="mb-2">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Загрузка данных из Google...</p>
            </Col>
          )}
          {!loadingGoogle && <LinksTable links={links} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;

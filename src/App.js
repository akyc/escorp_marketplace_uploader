import { useEffect, useState } from "react";
import { API } from "./utils/Api";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";

function App() {
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [loadingUploding, setLoadingUploading] = useState(true);

  function handleSubmit(e) {
    e.preventDefaul();
    const form = e.currentTarget;
  }

  useEffect(() => {
    // API.getUploadedInfo().then(data => {
    //   console.log(data)
    //   setLoadingGoogle(false)
    // })
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
                  <Spinner animation="border" role="status" size="sm" as="span">Загрузка</Spinner>
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Загрузить
                </Button>
              )}
            </Form>
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
        </Row>
      </Container>
    </div>
  );
}

export default App;

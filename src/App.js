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
  ProgressBar
} from "react-bootstrap";
import {
  forEach
} from "react-bootstrap/ElementChildren";

function App() {
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [loadingUploding, setLoadingUploading] = useState(false);
  const [hasError, serHasError] = useState(false);
  const [links, setLinks] = useState();
  const [form, setForm] = useState([]);
  const [progress, setProgress] = useState(0);

  let errors = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingUploading(true)

    Promise.allSettled(Object.values(form).map( file => {
      const formData = new FormData()
      formData.append('image', file )
      return API.UploadImage(formData).then(resp => {
        setProgress(Math.floor((progress + 1)*100/form.length))
        return resp
      })
    })).then(results => {
      Promise.allSettled(results.map( result => {
        if(result.status === "fulfilled" && "value" in result){
          let formData = new FormData()
          formData.append('filename', result.value.data.image.filename)
          formData.append('image_url', result.value.data.image.url)
          formData.append('thumb_url', result.value.data.thumb.url)
          return API.storeUploadedInfo(formData)
        } else {
          console.log(result)
        }
      })).then(resp => {
        resp.forEach(r => console.log(r))
        setLoadingUploading(false)
        setForm([])
      })
    }).catch(err => {console.error(err)})

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
            <Form className="p-5 bg-body-tertiary" onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="mb-3" controlId="formBasicFiles">
                <Form.Control
                  type="file"
                  placeholder="Выберите файлы"
                  name={'files'}
                  onChange={(e) => {
                    setForm(e.target.files)
                  }}
                  multiple
                />
                <Form.Text className="text-muted">
                  Файлы для маркетлейсов только в формате .jpg и .png
                </Form.Text>
              </Form.Group>
              {loadingUploding ? (
                <Button variant="primary" disabled>
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
            {progress ? <ProgressBar now={progress} /> : ''}
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

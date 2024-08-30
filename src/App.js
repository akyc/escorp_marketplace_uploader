import { useEffect, useState } from "react";
import { API } from "./utils/Api";
import { LinksTable } from "./LinksTable";
import { Error } from "./Error";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  Spinner,
  ProgressBar
} from "react-bootstrap";

function App() {
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [loadingUploding, setLoadingUploading] = useState(false);
  const [loadingErrors, setLoadingErrors] = useState([]);
  const [links, setLinks] = useState();
  const [form, setForm] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoadingUploading(true)
    setLoadingErrors([])

    const uploadingFiles = Object.values(form).map(file => {
      const formData = new FormData()
      formData.append('image', file)
      return API.UploadImage(formData).then(data => {
        return data
      }).catch(err => {
        if (err) {
          let error = err.json()
          error.then(info => {
            setLoadingErrors((errors) => {
              if (!errors.some(err => err.file.name === file.name)) {
                errors.push({ info, file })
              }
              return errors
            })
          })
        }
      }).finally((data) => {
        setProgress((p) => p + Math.floor(100 / form.length))
        return data
      })
    })

    Promise
      .all(uploadingFiles)
      .then(results => {
        let uploadedImages = results.filter(el => el.status === 200)
        return Promise
          .allSettled(uploadedImages.map((result, index) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                let formData = new FormData()
                formData.append('links[]', `${result.data.image.filename};${result.data.image.url};${result.data.thumb.url}`)
                API.storeUploadedInfo(formData).then(() => resolve())
              }, index * 500)
            })
          }))
          .catch(err => {
            if (err) {
              let error = err.json()
              error.then(info => {
                setLoadingErrors((errors) => {
                  errors.push({ info, results: JSON.stringify(results) })
                  return errors
                })
              })
            }
          })
      })
      .then(() => {
        setLoadingUploading(false)
      })
      .catch(err => {
        if (err) {
          let error = err.json()
          error.then(info => {
            setLoadingErrors((errors) => {
              errors.push({ info })
              return errors
            })
          })
        }
      })
      .finally(_ => {
        if (!loadingErrors.length) {
          window.location.reload()
        }
      });
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
            {progress && loadingUploding ? <ProgressBar now={progress} /> : ''}
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="6" className="py-3">
            {loadingErrors && loadingErrors.length ? <Error errors={loadingErrors} /> : ''}
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
              <p>Получение данных из Google...</p>
            </Col>
          )}
          {!loadingGoogle && <LinksTable links={links} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;

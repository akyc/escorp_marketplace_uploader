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

    const errorHandler = (error) => {
      
    }

    const uploadingFiles = Object.values(form).map(file => {
      const formData = new FormData()
      formData.append('image', file)
      return API.UploadImage(formData).then(data => {
        setProgress((p) => p + Math.floor(100 / form.length))
        return data
      }).catch(err => {
        setProgress((p) => p + Math.floor(100 / form.length))
        console.log(err)
        let error = err.json()
        error.then(info => {
          setLoadingErrors((errors) => {
            if (!errors.some(err => err.file.name === file.name)) {
              errors.push({ info, file })
            }
            return errors
          })
        })
      })
    })

    Promise
      .all(uploadingFiles)
      .then(results => {

        results.forEach((result) => console.log(result.status))

        // let uploadedImages = Helpers.chunk(results, 10)
        let uploadedImages = results
        return Promise
          .allSettled(uploadedImages.map((result, index) => {
            // let formData = new FormData()
            // result.forEach((link) => {
            //   console.log(link)
            //   formData.append('links[]', `${link.data.image.filename};${link.data.image.url};${link.data.thumb.url}`)
            // })
            // return API.storeUploadedInfo(formData)
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                let formData = new FormData()
                formData.append('links[]', `${result.data.image.filename};${result.data.image.url};${result.data.thumb.url}`)
                API.storeUploadedInfo(formData).then(() => resolve())
              }, index * 350)
            })
          }))
          .then(resp => {
            console.log("allSettled resp: ", resp)
            //setLoadingUploading(false)
          })
          .catch(error => console.log('error: ', error))
      })
      .then(resp => {
        console.log("Promise.all resp: ", resp)
        setLoadingUploading(false)
      })
      .catch(error => console.log('error: ', error))
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
  }, [links]);

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

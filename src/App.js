import { useEffect, useState } from "react";
import { API } from "./utils/Api";
import { supabase } from './utils/supabase';
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
  const [loadingSupabase, setLoadingSupabase] = useState(true);
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
      console.log(file)
      return API.UploadImage(formData).then(data => {
        setProgress((p) => p + Math.floor(100 / form.length))
        return data
      })
    })

    Promise
      .allSettled(uploadingFiles)
      .then(results => {
        let links = results.filter(el => el.value.status === 200).map(({ value }) => ({
          "name": value.data.image.filename, "image_url": value.data.image.url, "thumb_url": value.data.thumb.url
        }))
        setUploadedFiles(links)
        setLoadingUploading(false)
        setForm([])
        setLoadingSupabase(true);
      })
      .catch(err => {
        if (err) {
          setLoadingErrors((errors) => {
            errors.push({ err })
            return errors
          })
        }
      })
    // .finally(_ => {
    //   if (!loadingErrors.length) {
    //     window.location.reload()
    //   }
    // });
  }

  async function setUploadedFiles(files) {
    const { data, error } = await supabase
      .from('uploaded_files')
      .insert(files)
      .select()

    setLinks(data);
    setLoadingSupabase(false);

    if (error) {
      console.error(error)
    }

  }

  useEffect(() => {

    async function getUploadedFiles() {

      let { data, error } = await supabase
        .from('uploaded_files')
        .select('*')

      setLinks(data);
      setLoadingSupabase(false);

      if (error) {
        console.error(error)
      }

    }

    getUploadedFiles()

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
          {loadingSupabase && (
            <Col md="10" className="text-center">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Получение данных из Supabase...</p>
            </Col>
          )}
          {!loadingSupabase && <LinksTable links={links} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;

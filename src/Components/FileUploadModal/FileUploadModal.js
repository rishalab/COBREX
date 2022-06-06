import { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import './FileUploadModal.css';
import jsonData from '../../temp-data.json';
import cfgData from '../../cfg.json';
import axios from 'axios';

const FileUploadModal = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);

  useEffect(() => {
    setModalShow(props.show);
  }, [props.show]);

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    if (!selectedFile) {
      return;
    }
    setUploading(true);
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append('file', selectedFile, selectedFile.name);

    // Details of the uploaded file

    axios
      .post(process.env.REACT_APP_API_URL + '/business_rules', formData)
      .then((response) => {
        console.log(response);
        localStorage.setItem(
          'business-rules-data',
          JSON.stringify(response.data.brs)
        );
        localStorage.setItem('cfg', JSON.stringify(response.data.cfg));

        props.fileUploadHandler(response.data.brs, response.data.cfg);
        setModalShow(false);
        setSelectedFile(null);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setAlertShow(true);
        setUploading(false);
        setSelectedFile(null);
      });

    // // Request made to the backend api
    // // Send formData object
    // axios.post('api/uploadfile', formData);
  };

  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h4>File Details:</h4>
          <p>File Name: {selectedFile.name}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
  return (
    <Modal
      show={modalShow}
      size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          COBOL Business Rules Extractor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Upload File</h4>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        {fileData()}
        {alertShow ? (
          <Alert
            variant="danger"
            onClose={() => setAlertShow(false)}
            dismissible
          >
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>Some error occurred while processing your file.</p>
          </Alert>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onFileUpload} disabled={uploading}>
          {uploading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : null}
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadModal;

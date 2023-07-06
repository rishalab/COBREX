/*
*   Copyright © 2023 Dr. Sridhar Chimalakonda, Risha Lab
*/
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FileResults from './Components/FileResults/FileResults';
import { Navbar, Container, Button } from 'react-bootstrap';
import FileUploadModal from './Components/FileUploadModal/FileUploadModal';

function App() {
  const [businessRulesData, setBusinessRulesData] = useState(null);
  const [cfgData, setCfgData] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem('business-rules-data'));
    const brJSONData = localStorage.getItem('business-rules-data');
    const cfgJSONData = localStorage.getItem('cfg');
    if (brJSONData && brJSONData != 'undefined') {
      console.log('here');
      const data = JSON.parse(brJSONData);
      console.log(data);
      setBusinessRulesData(data);
    }

    if (cfgJSONData && cfgJSONData != 'undefined') {
      const data = JSON.parse(cfgJSONData);
      setCfgData(data);
    }
  }, []);

  const clearData = () => {
    localStorage.removeItem('business-rules-data');
    localStorage.removeItem('cfg');

    setBusinessRulesData(null);
    setCfgData(null);
  };

  const fileUploadHandler = (businessRulesDataJSON, cfgDataJSON) => {
    const data = JSON.parse(JSON.stringify(businessRulesDataJSON));
    setBusinessRulesData(data);

    setCfgData(JSON.parse(JSON.stringify(cfgDataJSON)));
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home" style={{ fontSize: '2em' }}>
            Business Rules Extractor
          </Navbar.Brand>
          <Button variant="light" onClick={clearData}>
            Upload new File
          </Button>
        </Container>
      </Navbar>
      <FileUploadModal
        show={!(businessRulesData && cfgData)}
        fileUploadHandler={fileUploadHandler}
      />
      {businessRulesData && cfgData ? (
        <FileResults businessRulesData={businessRulesData} cfgData={cfgData} />
      ) : null}
    </div>
  );
}

export default App;

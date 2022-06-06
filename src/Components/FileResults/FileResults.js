import { useState, useEffect } from 'react';
import './FileResults.css';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
// import jsonData from '../../temp-data.json';
// import cfgData from '../../cfg.json';
import randomColor from 'randomcolor';
import DotGraph from '../DotGraph/DotGraph';
import axios from 'axios';
import download from 'downloadjs';

const FileResults = (props) => {
  const [businessRulesData, setBusinessRulesData] = useState(null);
  const [cfgData, setCfgData] = useState(null);
  const [businessVariables, setBusinessVariables] = useState([]);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [currentDotGraph, setCurrentDotGraph] = useState(null);
  const [mergeSelected, setMergeSelected] = useState(false);

  const possibleEdges = [
    'start',
    'perform',
    'evaluate when',
    'search when',
    'iteration',
    'procedure call',
    'true',
    'false',
    'onexception',
    'notonexception',
    'onsizeerror',
    'notonsizeerror',
    'onoverflow',
    'invalidkey',
    'notinvalidkey',
    'atend',
    'notatend',
    'procedure backward call',
    'backward',
    'evaluate exit',
    'search exit',
    'perform-exit',
    'next sentence',
    'sequential next',
  ];

  const edgeColors = {};

  possibleEdges.forEach((edge) => {
    edgeColors[edge] = randomColor();
  });

  useEffect(() => {
    //console.log();
    setBusinessRulesData(props.businessRulesData['business_rules']);
    setBusinessVariables(
      props.businessRulesData['business_variables'].map((variable) => {
        return { name: variable, selected: false };
      })
    );
    setCfgData(props.cfgData);
  }, [props.businessRulesData, props.cfgData]);

  const visualizeCFG = () => {
    clearSelections();
    const cfg = cfgData;
    if (cfg) {
      const position = { x: 0, y: 0 };
      const edgeType = 'SimpleBezier';

      const nodes = new Set();
      const edges = new Set();

      cfg.nodes.forEach((node) => {
        let modified_node = Object.assign(node, {
          position: position,
        });
        if (node.id == 'start') {
          modified_node = Object.assign(node, {
            position: position,
            type: 'input',
            style: {
              backgroundColor: '#FFCC00',
            },
          });
        }

        nodes.add(JSON.stringify(modified_node));
      });

      cfg.edges.forEach((edge) => {
        const modified_edge = Object.assign(edge, {
          type: edgeType,
          animated: true,
          markerEnd: {
            type: 'arrowclosed',
            color: 'black',
          },
          style: {
            stroke: edgeColors[edge.label],
          },
        });

        edges.add(JSON.stringify(modified_edge));
      });

      const newGraph = {
        nodes: [],
        edges: [],
      };

      nodes.forEach((node) => {
        newGraph['nodes'].push(JSON.parse(node));
      });

      edges.forEach((edge) => {
        newGraph['edges'].push(JSON.parse(edge));
      });

      if (newGraph.nodes.length == 0) {
        setCurrentGraph(null);
        setCurrentDotGraph(null);
      }

      axios
        .post(
          'https://pacific-waters-96516.herokuapp.com' + '/graphdot',
          newGraph
        )
        .then((response) => {
          //console.log(response);
          setCurrentGraph(newGraph);
          setCurrentDotGraph(response.data['dot_code']);
        })
        .catch((err) => {
          setCurrentGraph(null);
          setCurrentDotGraph(null);
        });
    }
  };

  const variableChangeHandler = (name) => {
    const modifiedBusinessVariables = businessVariables.map(
      (businessVariable) => {
        if (businessVariable.name === name) {
          businessVariable.selected = !businessVariable.selected;
        }
        return businessVariable;
      }
    );
    //console.log(modifiedBusinessVariables);
    setBusinessVariables(modifiedBusinessVariables);
  };

  const clearSelections = () => {
    const modifiedBusinessVariables = businessVariables.map(
      (businessVariable) => {
        businessVariable.selected = false;
        return businessVariable;
      }
    );

    setBusinessVariables(modifiedBusinessVariables);
    setCurrentGraph(null);
  };

  const viewBusinessRulesHandler = () => {
    const position = { x: 0, y: 0 };
    const edgeType = 'SimpleBezier';

    const nodes = new Set();
    const edges = new Set();

    businessVariables.forEach((businessVariable) => {
      if (businessVariable.selected) {
        //console.log(businessRulesData, businessVariable.name);
        const businessRules = businessRulesData[businessVariable.name];
        businessRules.nodes.forEach((node) => {
          let modified_node = { ...node };
          if (node.id == businessVariable.name) {
            modified_node = Object.assign(node, {
              position: position,
              type: 'input',
            });
          } else {
            if (!mergeSelected) {
              modified_node.id = businessVariable.name + modified_node.id;
            }
          }

          nodes.add(JSON.stringify(modified_node));
        });

        businessRules.edges.forEach((edge) => {
          const modified_edge = { ...edge };
          if (!mergeSelected) {
            if (modified_edge.source != businessVariable.name) {
              modified_edge.source =
                businessVariable.name + modified_edge.source;
            }

            modified_edge.target = businessVariable.name + modified_edge.target;
          }

          edges.add(JSON.stringify(modified_edge));
        });
      }
    });

    const newGraph = {
      nodes: [],
      edges: [],
    };

    nodes.forEach((node) => {
      newGraph['nodes'].push(JSON.parse(node));
    });

    edges.forEach((edge) => {
      newGraph['edges'].push(JSON.parse(edge));
    });

    if (newGraph.nodes.length == 0) {
      setCurrentGraph(null);
      setCurrentDotGraph(null);
    }

    axios
      .post(
        'https://pacific-waters-96516.herokuapp.com' + '/graphdot',
        newGraph
      )
      .then((response) => {
        setCurrentGraph(newGraph);
        setCurrentDotGraph(response.data['dot_code']);
      })
      .catch((err) => {
        setCurrentGraph(null);
        setCurrentDotGraph(null);
      });
  };

  const mergeChangeHandler = () => {
    setMergeSelected(!mergeSelected);
  };

  const selectAllHandler = () => {
    const modifiedBusinessVariables = businessVariables.map(
      (businessVariable) => {
        businessVariable.selected = true;

        return businessVariable;
      }
    );
    //console.log(modifiedBusinessVariables);
    setBusinessVariables(modifiedBusinessVariables);
  };

  const exportGraphHandler = (format) => {
    //console.log(format);
    if (!currentGraph) {
      return;
    }
    // fetch('http://localhost:105/export', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //   },
    //   body: JSON.stringify({
    //     graph: currentGraph,
    //     format: format,
    //   }),
    // })
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     // Create blob link to download
    //     const url = window.URL.createObjectURL(new Blob([blob]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', `FileName.pdf`);

    //     // Append to html link element page
    //     document.body.appendChild(link);

    //     // Start download
    //     link.click();

    //     // Clean up and remove the link
    //     link.parentNode.removeChild(link);
    //   });
    axios
      .post(
        'https://pacific-waters-96516.herokuapp.com' + '/export',
        {
          graph: currentGraph,
          format: format,
        },
        { responseType: 'blob' }
      )
      .then((response) => {
        //console.log(response);
        // window.open(URL.createObjectURL(response.data));
        const content = response.headers['content-type'];
        download(response.data, 'output', content);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="FileResults">
      <Container fluid>
        <Row>
          <Col xs={3} id="sidebar-wrapper">
            <Sidebar
              businessVariables={businessVariables}
              variableChangeHandler={variableChangeHandler}
              clearSelections={clearSelections}
              viewBusinessRulesHandler={viewBusinessRulesHandler}
              visualizeCFG={visualizeCFG}
              mergeSelected={mergeSelected}
              mergeChangeHandler={mergeChangeHandler}
              exportGraphHandler={exportGraphHandler}
              selectAllHandler={selectAllHandler}
            />
          </Col>
          {/* <Col xs={9} id="page-content-wrapper">
            {currentGraph ? (
              <>
                <Graph graph={currentGraph} />
              </>
            ) : (
              <div className="FileResults-placeholder">
                <h4>Nothing to render :(</h4>
              </div>
            )}
          </Col> */}
          <Col xs={9} id="page-content-wrapper">
            {currentGraph ? (
              <>
                <DotGraph graph={currentDotGraph} />
              </>
            ) : (
              <div className="FileResults-placeholder">
                <h4>Nothing to render :(</h4>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FileResults;

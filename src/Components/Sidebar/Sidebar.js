import React from 'react';
import { Button, Nav, Form, Dropdown } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = (props) => {
  return (
    <>
      <Nav
        className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
        <div className="sidebar-cfg">
          <Nav.Item>
            <Button
              variant="dark"
              onClick={() => {
                props.visualizeCFG();
              }}
            >
              View Control Flow Graph
            </Button>
          </Nav.Item>
        </div>

        <hr />
        <div className="sidebar-business-rules">
          <h4> Business Variables</h4>
          <Form className="sidebar-checkbox">
            <Button
              variant="outline-dark"
              onClick={(e) => {
                props.selectAllHandler();
              }}
            >
              {' '}
              Select All{' '}
            </Button>
            {props.businessVariables.map(({ name, selected }) => (
              <div key={name} className="mb-2 sidebar-checkbox-item">
                <Form.Check
                  type={'checkbox'}
                  id={name}
                  label={name}
                  checked={selected}
                  onChange={(e) => {
                    props.variableChangeHandler(name);
                  }}
                />
              </div>
            ))}
          </Form>
          <div className="sidebar-view-business-rules-button">
            <Form.Check
              type={'checkbox'}
              label={'Merge Selected Variables'}
              className="merge-checkbox"
              checked={props.mergeSelected}
              onChange={(e) => {
                props.mergeChangeHandler();
              }}
            />

            <Button
              variant="outline-secondary"
              className="mb-2"
              onClick={() => {
                props.clearSelections();
              }}
            >
              Clear
            </Button>
            <Button
              variant="dark"
              className="mb-2"
              onClick={() => {
                props.viewBusinessRulesHandler();
              }}
            >
              View Business Rules
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Export Graph
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    props.exportGraphHandler('pdf');
                  }}
                >
                  as PDF
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    props.exportGraphHandler('png');
                  }}
                >
                  as PNG
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Nav>
    </>
  );
};

export default Sidebar;

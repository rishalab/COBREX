import './BusinessVariables.css';

const FileResults = ({ businessVariables }) => {
  return (
    <div className="BusinessVariables">
      <div>
        <h3> Business Variables</h3>
      </div>

      <div>{businessVariables.map((variable) => {})}</div>
    </div>
  );
};

export default FileResults;

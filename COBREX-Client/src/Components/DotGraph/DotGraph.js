import { Graphviz } from 'graphviz-react';
import './DotGraph.css';

const DotGraph = ({ graph }) => {
  //   const dot = `digraph cluster {
  // 	graph [label=test]
  // 	1 [label="ACCEPT NUM
  // "]
  // 	2 [label="DIVIDE NUM BY 2 GIVING QUOTIENT REMAINDER REMAIN
  // "]
  // 	3 [label="IF REMAIN = 0
  // "]
  // 	4 [label="DISPLAY NUM ' IS EVEN'
  // "]
  // 	5 [label="STOP RUN
  // "]
  // 	4 -> 5 [label="sequential next"]
  // 	3 -> 4 [label=true]
  // 	6 [label="DISPLAY NUM ' IS ODD'
  // "]
  // 	6 -> 5 [label="sequential next"]
  // 	3 -> 6 [label=false]
  // 	2 -> 3 [label="sequential next"]
  // 	1 -> 2 [label="sequential next"]
  // }
  // `;

  return (
    <div className="graph-wrapper">
      <Graphviz
        options={{ fit: true, height: '100%', width: '100%', zoom: true }}
        dot={graph}
      />
    </div>
  );
};

export default DotGraph;

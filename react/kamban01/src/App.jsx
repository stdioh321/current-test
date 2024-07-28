import { useEffect, useState } from "react";

import "./App.css";
import { columnsAndLeads } from "./initial-data";
import Board from "./Board";

const handleOnDragStart = (result) => console.log("onDragStart: ", result);
const handleOnDragUpdate = (result) => console.log("onDragUpdate: ", result);

const App = () => {
  const [data, setData] = useState(null);

  const handleOnDragEnd = (result) => {
    console.log({ result });
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const sourceColumn = data.find(
      (column) => column.id === source.droppableId
    );
    const destinationColumn = data.find(
      (column) => column.id === destination.droppableId
    );
    const [removed] = sourceColumn.leads.splice(source.index, 1);
    destinationColumn.leads.splice(destination.index, 0, removed);

    setData([...data]);
  };

  useEffect(() => {
    setData(columnsAndLeads);
  }, []);
  return <Board data={data} handleOnDragEnd={handleOnDragEnd} />;
};

export default App;

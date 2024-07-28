import { DragDropContext } from "react-beautiful-dnd";

import Column from "./Column";
import { columnsAndLeads } from "./initial-data";
import { useEffect, useState } from "react";
import styled from "styled-components";

const handleOnDragStart = (result) => console.log("onDragStart: ", result);
const handleOnDragUpdate = (result) => console.log("onDragUpdate: ", result);

const Container = styled.div`
  padding: 20px;
  border: solid red 1px;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
  overflow-x: scroll;
`;

const App = () => {
  const [data, setData] = useState(null);

  const handleOnDragEnd = (result) => {
    console.log({result});
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
  return (
    <Container>
      <DragDropContext
        // onDragStart={handleOnDragStart}
        // onDragUpdate={handleOnDragUpdate}
        onDragEnd={handleOnDragEnd}
      >
        <Columns>
          {data?.map((column) => {
            return (
              <Column
                key={column.id}
                column={column}
                leads={column.leads || []}
              />
            );
          })}
        </Columns>
      </DragDropContext>
    </Container>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";

const Container = styled.div`
  /* box-shadow: 0 0 0px 20px #FFF inset; */
  border: 20px #fff solid;
  overflow-x: auto;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
`;

export default function Board({
  data: _data,
  handleOnDragEnd: _handleOnDragEnd,
  handleOnDragStart: _handleOnDragStart = () => {},
  handleOnDragUpdate: _handleOnDragUpdate = () => {},
}) {
  const [data, setData] = useState(null);

  const onDragEnd = (result) => {
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

  const handleOnDragEnd = async (result) => {
    const currentData = JSON.parse(JSON.stringify(data)) || [];

    try {
      onDragEnd(result);
      const response = await _handleOnDragEnd(result);
      if (!response) throw new Error("Network response was not ok");
    } catch (err) {
      console.error("Error occurred while handling onDragEnd", { err, result });
      setData(currentData);
    }
  };

  useEffect(() => {
    setData(_data);
  }, [_data]);

  const _ListColumns = data?.map((column) => {
    return (
      <Column key={column.id} column={column} leads={column.leads || []} />
    );
  });
  return (
    <Container>
      <DragDropContext
        onDragStart={_handleOnDragStart}
        onDragUpdate={_handleOnDragUpdate}
        onDragEnd={handleOnDragEnd}
      >
        <Columns>{_ListColumns}</Columns>
      </DragDropContext>
    </Container>
  );
}

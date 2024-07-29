import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  border: 20px #fff solid;
  overflow-x: auto;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
`;

const Column = ({ column, leads }) => {
  const Container3 = styled.div`
    border: 1px solid lightgray;
    border-radius: 10px;
    width: 300px;
    min-width: 300px;
    padding: 8px;
  `;

  const Title = styled.div`
    padding: 8px;
    font-size: 1.4em;
    color: #0000ff;
  `;

  const LeadList = styled.div`
    padding: 8px;
    max-height: 400px;
    overflow-y: auto;
  `;

  const Container4 = styled.div`
    padding: 8px;
    border: 3px solid lightgray;
    border-radius: 10px;
    margin-bottom: 9px;
    height: 120px;
  `;

  const LeadCard = ({ lead, index }) => {
    return (
      <Draggable key={lead.id} draggableId={lead.id} index={index}>
        {(provided) => (
          <Container4
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div style={{ fontWeight: "bold" }}>{lead.title}</div>
            <small>R$ {lead.uniqueValue}</small>
          </Container4>
        )}
      </Draggable>
    );
  };

  return (
    <Container3>
      <Title>{column.title}</Title>
      <hr />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <LeadList ref={provided.innerRef} {...provided.droppableProps}>
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
          </LeadList>
        )}
      </Droppable>
    </Container3>
  );
};

export function Board({
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
    return <Column key={column.id} column={column} leads={column.leads || []} />;
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


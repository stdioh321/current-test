import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import Column from "./Column";

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

export default function Board({
  data,
  handleOnDragStart,
  handleOnDragUpdate,
  handleOnDragEnd,
}) {
  return (
    <Container>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragUpdate={handleOnDragUpdate}
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
}

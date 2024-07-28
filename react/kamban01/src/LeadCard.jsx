import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  padding: 8px;
  border: 3px solid lightgray;
  border-radius: 10px;
  margin-bottom: 9px;
  height: 120px;
`;

export default function LeadCard({ lead, index }) {
  return (
    <Draggable key={lead.id} draggableId={lead.id} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div style={{ fontWeight: "bold" }}>{lead.title}</div>
          <small>R$ {lead.uniqueValue}</small>
        </Container>
      )}
    </Draggable>
  );
}

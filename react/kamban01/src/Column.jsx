import React from "react";
import styled from "styled-components";
import LeadCard from "./LeadCard";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
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

export default function Column({ column, leads }) {
  return (
    <Container>
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
    </Container>
  );
}

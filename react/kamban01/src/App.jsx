import "./App.scss";
import { columnsAndLeads } from "./initial-data";
import styled from "styled-components";
import Board from "./Board";

const Container = styled.div`
  margin: 8px;
  padding: 8px;
  box-shadow: 0 0 0px 2px #c2bdbd inset;
  border-radius: 8px;
`;

/**
 * Handle the drag start event.
 *
 * @param {Object} result - The drag start event.
 */
const handleOnDragStart = (result) => {
  // console.log("onDragStart: ", result)
};

/**
 * Handle the drag update event.
 *
 * @param {Object} result - The drag update event.
 */
const handleOnDragUpdate = (result) => {
  // console.log("onDragUpdate: ", result)
};
/**
 * Handle the drag end event.
 *
 * @param {Object} dragEvent - The drag end event.
 * @return {Promise} A promise that resolves when the drag end event is handled.
 */
const handleOnDragEnd = async (dragEvent) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    await response.json();
    const forceThrow = Math.random() < 0.5;
    if (forceThrow) {
      throw new Error("forceThrow");
    }
  } catch (err) {
    console.error("-----------------------------------------------");
    console.error("handleOnDragEnd: error occurred");
    console.error(err);
    console.error("-----------------------------------------------");
  }
};

const App = () => {
  return (
    <Container>
      <Board
        data={columnsAndLeads}
        handleOnDragStart={handleOnDragStart}
        handleOnDragUpdate={handleOnDragUpdate}
        handleOnDragEnd={handleOnDragEnd}
      />
    </Container>
  );
};

export default App;

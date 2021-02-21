import styled from "styled-components"
import { Draggable } from "react-beautiful-dnd"

interface TaskProps {
  task: TaskInterface
  index: number
}

export const Task = ({ task, index }: TaskProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <h5>{task.content}</h5>
        </Container>
      )}
    </Draggable>
  )
}

const Container = styled.div<{ isDragging?: boolean }>`
  border: 1px solid lightgray;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
  display: flex;
  align-items: center;
`

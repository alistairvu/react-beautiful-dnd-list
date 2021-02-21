import styled from "styled-components"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Task } from "./Task"
import { Button, Form } from "react-bootstrap"
import { useState, useRef, useEffect } from "react"
import useToDo, { ToDoState } from "../zustand/useToDo"
interface ColumnProps {
  column: ColumnInterface
  tasks: TaskInterface[]
  index: number
}

export const Column = ({ column, tasks, index }: ColumnProps) => {
  const [adding, setAdding] = useState(false)
  const [newToDo, setNewToDo] = useState("")
  const addItem = useToDo((state: ToDoState) => state.addItem)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [adding])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newToDo.trim()) {
      addItem(column.id, newToDo)
      setNewToDo("")
    }
  }

  const renderAddForm = () => {
    if (adding) {
      return (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="new-todo">
            <Form.Control
              type="text"
              name="todo"
              value={newToDo}
              placeholder="Enter new item..."
              onChange={(e) => setNewToDo(e.target.value)}
              ref={inputRef}
            />
          </Form.Group>
          <Button type="submit" variant="success" className="mr-2">
            Add
          </Button>
          <Button variant="danger" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </Form>
      )
    }

    return (
      <Button variant="light" onClick={() => setAdding(true)}>
        Add new item
      </Button>
    )
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="p-2 "
        >
          <div {...provided.dragHandleProps}>
            <Title>{column.title}</Title>
          </div>
          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task, index) => (
                  <Task task={task} key={task.id} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          {renderAddForm()}
        </Container>
      )}
    </Draggable>
  )
}

const Container = styled.div`
  background-color: lightgray;
  border: 1px solid lightgray;
  border-radius: 2px;
  margin: 8px;
  width: 300px;
`

const Title = styled.h3`
  padding: 8px;
`

const TaskList = styled.div<{ isDraggingOver?: boolean }>`
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "skyblue" : "lightgray"};
`

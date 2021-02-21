import { Column } from "./components"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { useState, useRef, useEffect } from "react"
import { Button, Form } from "react-bootstrap"
import useToDo from "./zustand/useToDo"

const App = () => {
  const [adding, setAdding] = useState(false)
  const [newColumn, setNewColumn] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    columnOrder,
    columns,
    tasks: taskList,
    addColumn,
    reorderItems,
    reorderColumns,
  } = useToDo()

  useEffect(() => {
    inputRef.current?.focus()
  }, [adding])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newColumn.trim()) {
      addColumn(newColumn)
      setNewColumn("")
    }
  }

  const renderAddForm = () => {
    if (adding) {
      return (
        <Form onSubmit={submitHandler} className="m-2">
          <Form.Group controlId="new-column">
            <Form.Control
              type="text"
              name="todo"
              value={newColumn}
              placeholder="Enter new column title"
              onChange={(e) => setNewColumn(e.target.value)}
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
      <Button
        variant="light"
        onClick={() => setAdding(true)}
        className="h-60 m-2"
      >
        Add new column
      </Button>
    )
  }

  const onDragEnd = (result: any) => {
    switch (result.type) {
      case "TASK": {
        reorderItems(result)
        break
      }
      case "COLUMN": {
        console.log("changing columns")
        reorderColumns(result)
        break
      }
    }
  }

  const renderColumns = () => {
    return columnOrder.map((columnId, index) => {
      const column = columns[columnId]
      const tasks = column.taskIds.map((taskId: string) => taskList[taskId])
      return (
        <Column key={column.id} column={column} tasks={tasks} index={index} />
      )
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
        {(provided) => (
          <div
            className="m-2 d-flex"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {renderColumns()}
            {renderAddForm()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default App

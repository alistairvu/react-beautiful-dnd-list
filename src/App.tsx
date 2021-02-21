import { Column } from "./components"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { useDispatch, useSelector } from "react-redux"
import { rootState } from "./redux"
import { reorderItems, reorderColumns, addColumn } from "./redux/toDoSlice"
import { useState, useRef, useEffect } from "react"
import { Button, Form, Row } from "react-bootstrap"

const App = () => {
  const [adding, setAdding] = useState(false)
  const [newColumn, setNewColumn] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()
  const { columnOrder, columns, tasks: taskList } = useSelector(
    (state: rootState) => state.toDo
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [adding])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newColumn.trim()) {
      dispatch(addColumn(newColumn))
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
      case "TASKS": {
        dispatch(reorderItems(result))
        break
      }
      case "COLUMNS": {
        dispatch(reorderColumns(result))
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
      <div className="row">
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="COLUMNS"
        >
          {(provided) => (
            <div
              className="m-2 d-flex justify-content-start"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {renderColumns()}
              {renderAddForm()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default App

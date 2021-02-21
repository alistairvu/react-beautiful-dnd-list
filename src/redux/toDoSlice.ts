import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import initialData from "../initial-data.json"

interface DragInfo {
  destination: any
  source: any
  draggableId: any
}

const initialState: ToDoInterface = {
  tasks: initialData.tasks,
  columns: initialData.columns,
  columnOrder: initialData.columnOrder,
  taskCount: Object.keys(initialData.tasks).length,
  columnCount: Object.keys(initialData.columns).length,
}

const toDoSlice = createSlice({
  name: "toDo",
  initialState,

  reducers: {
    reorderItems: {
      prepare: (result) => ({
        payload: {
          destination: result.destination,
          source: result.source,
          draggableId: result.draggableId,
        },
      }),

      reducer: (state, action: PayloadAction<DragInfo>) => {
        console.log(state)
        const { destination, source, draggableId } = action.payload

        if (!destination) {
          return
        }

        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return
        }

        const sourceColumn = state.columns[source.droppableId]
        const destinationColumn = state.columns[destination.droppableId]
        const newSourceTasks = sourceColumn.taskIds
        newSourceTasks.splice(source.index, 1)
        const newDestinationTasks = destinationColumn.taskIds
        newDestinationTasks.splice(destination.index, 0, draggableId)

        const newSourceColumn = { ...sourceColumn, taskIds: newSourceTasks }
        const newDestinationColumn = {
          ...destinationColumn,
          taskIds: newDestinationTasks,
        }
        state.columns = {
          ...state.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn,
        }
      },
    },

    reorderColumns: {
      prepare: (result) => ({
        payload: {
          destination: result.destination,
          source: result.source,
          draggableId: result.draggableId,
        },
      }),

      reducer: (state, action: PayloadAction<DragInfo>) => {
        const { destination, source, draggableId } = action.payload

        if (!destination) {
          return
        }

        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return
        }

        const newColumnOrder = state.columnOrder
        newColumnOrder.splice(source.index, 1)
        newColumnOrder.splice(destination.index, 0, draggableId)
        state.columnOrder = newColumnOrder
      },
    },

    addItem: {
      prepare: (column: string, content: string) => ({
        payload: {
          column,
          content,
        },
      }),

      reducer: (
        state,
        action: PayloadAction<{ column: string; content: string }>
      ) => {
        const { column, content } = action.payload
        const newTaskId = `task-${state.taskCount + 1}`
        const newTask = {
          id: newTaskId,
          content: content,
        }
        state.tasks = { ...state.tasks, [newTaskId]: newTask }
        state.columns[column].taskIds.push(newTaskId)
        state.taskCount = state.taskCount + 1
      },
    },

    addColumn: (state, action: PayloadAction<string>) => {
      const newColumnId = `column-${state.columnCount + 1}`
      const newColumn = {
        id: newColumnId,
        title: action.payload,
        taskIds: [],
      }
      state.columns[newColumnId] = newColumn
      state.columnOrder.push(newColumnId)
      state.columnCount = state.columnCount + 1
    },
  },
})

const { actions, reducer: toDoReducer } = toDoSlice
export const { reorderItems, reorderColumns, addItem, addColumn } = actions
export default toDoReducer

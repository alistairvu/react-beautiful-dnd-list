import create, { State } from "zustand"
import produce from "immer"
import initialData from "../initial-data.json"
import { persist, devtools } from "zustand/middleware"

export interface ToDoState extends State {
  tasks: { [key: string]: TaskInterface }
  columns: { [key: string]: ColumnInterface }
  columnOrder: string[]
  taskCount: number
  columnCount: number
  reorderItems: (result: any) => void
  reorderColumns: (result: any) => void
  addItem: (column: string, content: string) => void
  addColumn: (title: string) => void
}

const initialState = {
  tasks: initialData.tasks,
  columns: initialData.columns,
  columnOrder: initialData.columnOrder,
  taskCount: Object.keys(initialData.tasks).length,
  columnCount: Object.keys(initialData.columns).length,
}

const useToDo = create<ToDoState>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        reorderItems: (result: any) => {
          const { destination, source, draggableId } = result

          const sourceColumn = get().columns[source.droppableId]
          const destinationColumn = get().columns[destination.droppableId]

          const newSourceTasks = [...sourceColumn.taskIds]
          newSourceTasks.splice(source.index, 1)
          const newDestinationTasks = [...destinationColumn.taskIds]
          newDestinationTasks.splice(destination.index, 0, draggableId)

          const newSourceColumn = { ...sourceColumn, taskIds: newSourceTasks }
          const newDestinationColumn = {
            ...destinationColumn,
            taskIds: newDestinationTasks,
          }

          set((state) => ({
            columns: {
              ...state.columns,
              [newSourceColumn.id]: newSourceColumn,
              [newDestinationColumn.id]: newDestinationColumn,
            },
          }))
        },

        reorderColumns: (result: any) => {
          const { destination, source, draggableId } = result

          const newColumnOrder = [...get().columnOrder]
          newColumnOrder.splice(source.index, 1)
          newColumnOrder.splice(destination.index, 0, draggableId)

          set({
            columnOrder: newColumnOrder,
          })
        },

        addItem: (column: string, content: string) => {
          const newTaskId = `task-${get().taskCount + 1}`
          const newTask = {
            id: newTaskId,
            content: content,
          }

          set(
            produce((state) => {
              state.tasks = { ...state.tasks, [newTaskId]: newTask }
              state.columns[column].taskIds.push(newTaskId)
              state.taskCount = state.taskCount + 1
            })
          )
        },

        addColumn: (title: string) => {
          const newColumnId = `column-${get().columnCount + 1}`
          const newColumn = {
            id: newColumnId,
            title,
            taskIds: [],
          }

          set(
            produce((state) => {
              state.columns[newColumnId] = newColumn
              state.columnOrder.push(newColumnId)
              state.columnCount = state.columnCount + 1
            })
          )
        },
      }),
      { name: "@kanban" }
    ),
    "kanban"
  )
)

export default useToDo

interface ColumnInterface {
  id: string
  title: string
  taskIds: string[]
}

interface TaskInterface {
  id: string
  content: string
}

interface ToDoInterface {
  tasks: { [key: string]: TaskInterface }
  columns: { [key: string]: ColumnInterface }
  columnOrder: string[]
  taskCount: number
  columnCount: number
}

import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic

// const logger = createLogger('Todos business logic')
  
  // TODO: Implement businessLogic
  const todoAccess = new TodosAccess();

  export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId);
  }
  
  export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  
    const itemId = uuid.v4()
  
    return await todoAccess.createTodo({
      todoId: itemId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
    })
  }
  
  export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
    return await todoAccess.updateTodo(todoId, userId, {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    })
  }
  
  export async function deleteTodo(todoId: string, userId: string) {
    await todoAccess.deleteTodo(todoId, userId)
  }

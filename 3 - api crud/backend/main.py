from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4, UUID

app = FastAPI()


class Todo(BaseModel):
    id: Optional[UUID]
    title: str
    description: Optional[str] = None
    completed: bool = False


todos = {


}


@app.post("/todos/")
def create_todo(todo: Todo):
    todo.id = uuid4()
    todos[str(todo.id)] = todo
    return todo


@app.get("/todos/")
def read_todos():
    return todos


@app.get("/todos/{todo_id}")
def read_todo(todo_id: str):
    return todos[todo_id]


@app.put("/todos/{todo_id}")
def update_todo(todo_id: str, todo: Todo):
    todos[todo_id] = todo
    return todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    del todos[todo_id]
    return {"message": "Todo deleted"}

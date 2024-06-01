from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to allow requests from specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Define a ToDo model


class ToDoItem(BaseModel):
    id: int
    title: str
    description: str
    completed: bool = False


# In-memory database
db = [
    {"id": 1, "title": "Finish the tutorial",
        "description": "Complete the FastAPI tutorial", "completed": False},
    {"id": 2, "title": "Buy Groceries",
        "description": "Buy eggs, milk, butter, and bread", "completed": False},
    {"id": 3, "title": "Call Mom",
        "description": "Call mom to wish her happy birthday", "completed": False},
    {"id": 4, "title": "Learn Python",
        "description": "Learn Python programming", "completed": False},
]

# Function to get a ToDo item by its ID


def get_todo_by_id(todo_id: int):
    for todo in db:
        if todo["id"] == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="ToDo item not found")

# Routes


@app.get("/todos/", response_model=List[ToDoItem])
async def get_todos():
    return db


@app.post("/todos/", response_model=ToDoItem)
async def create_todo(todo: ToDoItem):
    todo_dict = todo.dict()
    db.append(todo_dict)
    return todo_dict


@app.get("/todos/{todo_id}", response_model=ToDoItem)
async def get_todo(todo_id: int):
    return get_todo_by_id(todo_id)


@app.put("/todos/{todo_id}", response_model=ToDoItem)
async def update_todo(todo_id: int, todo: ToDoItem):
    db_todo = get_todo_by_id(todo_id)
    updated_todo = todo.dict()
    db_todo.update(updated_todo)
    return db_todo


@app.delete("/todos/{todo_id}", response_model=ToDoItem)
async def delete_todo(todo_id: int):
    db_todo = get_todo_by_id(todo_id)
    db.remove(db_todo)
    return db_todo

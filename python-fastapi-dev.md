Sure! Here is a step-by-step guide to create an API development using FastAPI, integrate it with Swagger UI (built-in with FastAPI), and perform CRUD operations with in-memory storage using Python.

### Step 1: Set Up the Project

1. **Create a new directory for the project:**

    ```bash
    mkdir fastapi-crud
    cd fastapi-crud
    ```

2. **Create a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install FastAPI and Uvicorn:**

    ```bash
    pip install fastapi uvicorn
    ```

### Step 2: Set Up the Project Structure

1. **Create the following folder structure:**
    ```
    /app
      /models
      /routers
      /schemas
      /services
      main.py
    ```

### Step 3: Define Models and Schemas

1. **app/models/item.py:**

    ```python
    from pydantic import BaseModel

    class Item(BaseModel):
        id: int
        name: str
        description: str
    ```

2. **app/schemas/item.py:**

    ```python
    from pydantic import BaseModel

    class ItemCreate(BaseModel):
        name: str
        description: str

    class ItemUpdate(BaseModel):
        name: str
        description: str
    ```

### Step 4: Implement the In-Memory CRUD Operations

1. **app/services/item_service.py:**

    ```python
    from typing import List, Optional
    from app.models.item import Item

    items: List[Item] = []
    current_id = 1

    def get_all_items() -> List[Item]:
        return items

    def get_item_by_id(item_id: int) -> Optional[Item]:
        return next((item for item in items if item.id == item_id), None)

    def create_item(name: str, description: str) -> Item:
        global current_id
        new_item = Item(id=current_id, name=name, description=description)
        items.append(new_item)
        current_id += 1
        return new_item

    def update_item(item_id: int, name: str, description: str) -> Optional[Item]:
        item = get_item_by_id(item_id)
        if item:
            item.name = name
            item.description = description
            return item
        return None

    def delete_item(item_id: int) -> None:
        global items
        items = [item for item in items if item.id != item_id]
    ```

### Step 5: Implement the Routers

1. **app/routers/item_router.py:**

    ```python
    from fastapi import APIRouter, HTTPException
    from typing import List
    from app.models.item import Item
    from app.schemas.item import ItemCreate, ItemUpdate
    from app.services import item_service

    router = APIRouter()

    @router.get("/", response_model=List[Item])
    def read_items():
        return item_service.get_all_items()

    @router.get("/{item_id}", response_model=Item)
    def read_item(item_id: int):
        item = item_service.get_item_by_id(item_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return item

    @router.post("/", response_model=Item, status_code=201)
    def create_item(item: ItemCreate):
        return item_service.create_item(item.name, item.description)

    @router.put("/{item_id}", response_model=Item)
    def update_item(item_id: int, item: ItemUpdate):
        updated_item = item_service.update_item(item_id, item.name, item.description)
        if updated_item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return updated_item

    @router.delete("/{item_id}", status_code=204)
    def delete_item(item_id: int):
        item_service.delete_item(item_id)
    ```

### Step 6: Create the Main Application

1. **app/main.py:**

    ```python
    from fastapi import FastAPI
    from app.routers import item_router

    app = FastAPI()

    app.include_router(item_router.router, prefix="/items", tags=["items"])

    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000)
    ```

### Step 7: Run the Project

1. **Run the application:**
    ```bash
    uvicorn app.main:app --reload
    ```

Your FastAPI server with CRUD operations and Swagger UI is now running at `http://localhost:8000`. You can visit `http://localhost:8000/docs` to see the Swagger documentation and test the API endpoints.

### Summary

-   **Initialize FastAPI and Uvicorn**
-   **Set up project structure**
-   **Define models and schemas**
-   **Implement CRUD operations with in-memory storage**
-   **Create routers for endpoints**
-   **Run the server**

This FastAPI application provides a simple CRUD API with in-memory storage and auto-generated Swagger documentation.

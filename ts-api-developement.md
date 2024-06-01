Sure! Here is a step-by-step guide to create an API development using Express, integrate it with Swagger UI, use TypeScript, and perform CRUD operations with in-memory storage.

### Step 1: Set Up the Project

1. **Initialize a new Node.js project:**

    ```bash
    mkdir express-ts-swagger
    cd express-ts-swagger
    npm init -y
    ```

2. **Install necessary dependencies:**

    ```bash
    npm install express body-parser swagger-ui-express
    ```

3. **Install TypeScript and related types:**

    ```bash
    npm install typescript ts-node @types/node @types/express @types/body-parser
    ```

4. **Initialize TypeScript configuration:**

    ```bash
    npx tsc --init
    ```

### Step 2: Configure TypeScript

1. Open `tsconfig.json` and make sure it includes the following settings:
    ```json
    {
        "compilerOptions": {
            "target": "ES6",
            "module": "commonjs",
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "outDir": "./dist"
        },
        "include": ["src/**/*.ts"],
        "exclude": ["node_modules"]
    }
    ```

### Step 3: Set Up the Project Structure

1. **Create the following folder structure:**
    ```
    /src
      /routes
      /controllers
      /models
      /services
      app.ts
      swagger.json
    ```

### Step 4: Create the Basic Express Server

1. **src/app.ts:**

    ```typescript
    import express from "express";
    import bodyParser from "body-parser";
    import swaggerUi from "swagger-ui-express";
    import * as swaggerDocument from "./swagger.json";
    import { router as itemRouter } from "./routes/itemRoutes";

    const app = express();
    const port = 3000;

    app.use(bodyParser.json());
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use("/items", itemRouter);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
    ```

### Step 5: Define the Swagger Configuration

1. **src/swagger.json:**
    ```json
    {
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "Item API",
            "description": "Item API for CRUD operations"
        },
        "host": "localhost:3000",
        "basePath": "/",
        "schemes": ["http"],
        "paths": {
            "/items": {
                "get": {
                    "summary": "Get all items",
                    "responses": {
                        "200": {
                            "description": "Success"
                        }
                    }
                },
                "post": {
                    "summary": "Create a new item",
                    "parameters": [
                        {
                            "name": "item",
                            "in": "body",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Item"
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Created"
                        }
                    }
                }
            },
            "/items/{id}": {
                "get": {
                    "summary": "Get an item by ID",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Success"
                        },
                        "404": {
                            "description": "Not Found"
                        }
                    }
                },
                "put": {
                    "summary": "Update an item by ID",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer"
                        },
                        {
                            "name": "item",
                            "in": "body",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Item"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Updated"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete an item by ID",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "type": "integer"
                        }
                    ],
                    "responses": {
                        "204": {
                            "description": "No Content"
                        }
                    }
                }
            }
        },
        "definitions": {
            "Item": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            }
        }
    }
    ```

### Step 6: Implement the In-Memory CRUD Operations

1. **src/models/item.ts:**

    ```typescript
    export interface Item {
        id: number;
        name: string;
        description: string;
    }
    ```

2. **src/services/itemService.ts:**

    ```typescript
    import { Item } from "../models/item";

    let items: Item[] = [];
    let currentId = 1;

    export const getAllItems = (): Item[] => items;

    export const getItemById = (id: number): Item | undefined =>
        items.find((item) => item.id === id);

    export const createItem = (name: string, description: string): Item => {
        const newItem: Item = { id: currentId++, name, description };
        items.push(newItem);
        return newItem;
    };

    export const updateItem = (
        id: number,
        name: string,
        description: string
    ): Item | undefined => {
        const item = items.find((item) => item.id === id);
        if (item) {
            item.name = name;
            item.description = description;
        }
        return item;
    };

    export const deleteItem = (id: number): void => {
        items = items.filter((item) => item.id !== id);
    };
    ```

3. **src/controllers/itemController.ts:**

    ```typescript
    import { Request, Response } from "express";
    import * as itemService from "../services/itemService";

    export const getAllItems = (req: Request, res: Response) => {
        res.json(itemService.getAllItems());
    };

    export const getItemById = (req: Request, res: Response) => {
        const item = itemService.getItemById(parseInt(req.params.id));
        if (item) {
            res.json(item);
        } else {
            res.status(404).send("Item not found");
        }
    };

    export const createItem = (req: Request, res: Response) => {
        const { name, description } = req.body;
        const newItem = itemService.createItem(name, description);
        res.status(201).json(newItem);
    };

    export const updateItem = (req: Request, res: Response) => {
        const { name, description } = req.body;
        const updatedItem = itemService.updateItem(
            parseInt(req.params.id),
            name,
            description
        );
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).send("Item not found");
        }
    };

    export const deleteItem = (req: Request, res: Response) => {
        itemService.deleteItem(parseInt(req.params.id));
        res.status(204).send();
    };
    ```

4. **src/routes/itemRoutes.ts:**

    ```typescript
    import express from "express";
    import * as itemController from "../controllers/itemController";

    export const router = express.Router();

    router.get("/", itemController.getAllItems);
    router.get("/:id", itemController.getItemById);
    router.post("/", itemController.createItem);
    router.put("/:id", itemController.updateItem);
    router.delete("/:id", itemController.deleteItem);
    ```

### Step 7: Build and Run the Project

1. **Compile TypeScript:**

    ```bash
    npx tsc
    ```

2. **Run the project:**

    ```bash
    node dist/app.js
    ```

Your Express server with CRUD operations and Swagger UI is now running at `http://localhost:3000`. You can visit `http://localhost:3000/api-docs` to see the Swagger documentation and test the API endpoints.

---

---

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

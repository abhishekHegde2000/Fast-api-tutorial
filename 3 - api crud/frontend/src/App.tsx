// FILE: App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        axios.get("/todos/").then((response) => {
            setTodos(response.data);
        });
    }, []);

    const addTodo = () => {
        axios.post("/todos/", { title, description }).then((response) => {
            setTodos([...todos, response.data]);
        });
    };

    const deleteTodo = (id: string) => {
        axios.delete(`/todos/${id}`).then(() => {
            setTodos(todos.filter((todo) => todo.id !== id));
        });
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addTodo}
            >
                Add Todo
            </button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} className="mt-4">
                        <h2 className="font-bold text-xl">{todo.title}</h2>
                        <p className="text-gray-700">{todo.description}</p>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={() => deleteTodo(todo.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

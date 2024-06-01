// FILE: App.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ToDoItem {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

const App: React.FC = () => {
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            const response = await axios.get<ToDoItem[]>(
                "http://localhost:8000/todos/"
            );
            setTodos(response.data);
        };

        fetchTodos();
    }, []);

    const createTodo = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await axios.post<ToDoItem>(
            "http://localhost:8000/todos/",
            {
                title,
                description,
                completed: false,
            }
        );

        setTodos([...todos, response.data]);
        setTitle("");
        setDescription("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={createTodo}
                className="mb-4 flex flex-col items-center"
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="p-2 border mb-2 w-64"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="p-2 border mb-2 w-64"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white w-64"
                >
                    Create
                </button>
            </form>
            <div className="flex flex-col items-center">
                {todos.map((todo) => (
                    <div key={todo.id} className="mb-2 p-2 border w-64">
                        <h2 className="font-bold">{todo.title}</h2>
                        <p>{todo.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;

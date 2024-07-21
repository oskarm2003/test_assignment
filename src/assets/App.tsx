import LoginPage from "./loginPage/LoginPage";
import { Route, Routes } from "react-router-dom";
import TasksPage from "./TasksPage/TasksPage";
import { createContext } from "react";

export const UserTokenContext = createContext<string>("")

export default function App() {

    return <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/tasks" element={<TasksPage />} />
    </Routes>

}

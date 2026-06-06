import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import useBackForwardShortcuts from "./hooks/useBackForwardShortcuts";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound"
import Settings from "./pages/Settings";

function App() {
    useBackForwardShortcuts();
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route path="/" element={<Main />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;

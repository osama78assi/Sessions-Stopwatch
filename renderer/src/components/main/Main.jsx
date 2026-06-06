import { Outlet } from "react-router-dom";

function Main() {
    return (
        <div className={`main-content`}>
            <Outlet />
        </div>
    );
}

export default Main;

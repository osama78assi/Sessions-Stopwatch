import { useNavigate } from "react-router-dom";

function SidebarItem({
    icon,
    children,
    to,
    active = false,
    collapsed = false,
}) {
    const nav = useNavigate();

    function handleClick() {
        if (active) return;
        nav(to);
    }

    function handleKeyDown(event) {
        if (event.key !== "Enter" || active) return;
        nav(to);
    }

    const activeClass = active ? "cursor-default! " : "cursor-pointer";

    return (
        <li
            className={`nav-item ${activeClass}`}
            role="button"
            onClick={handleClick}
        >
            <div className="p-2 text-inherit">
                <div
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    className={`flex justify-start items-center flex-col gap-1.5 p-3 bg-(--thirdary-color) hover:bg-(--forthary-color) transition-colors rounded-2xl ${active ? "bg-(--forthary-color)! text-(--main-interactive-color-v1)" : ""}`}
                >
                    {icon}
                    <span className="text-lg">{children}</span>
                </div>
            </div>
        </li>
    );
}

export default SidebarItem;
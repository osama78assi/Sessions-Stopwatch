import useLocalStorageState from "../../hooks/useLocalStorageState";
import Stopwatch from "./Stopwatch";
import Sessions from "./Sessions";

export default function Main() {
    const [sessions, setSessions] = useLocalStorageState("sessions", []);

    return (
        <div className="w-full h-full flex flex-col lg:flex-row">
            <Stopwatch sessions={sessions} setSessions={setSessions} />

            <Sessions sessions={sessions} setSessions={setSessions} />
        </div>
    );
}

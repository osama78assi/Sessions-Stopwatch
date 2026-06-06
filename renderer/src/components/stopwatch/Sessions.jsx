import { memo } from "react";
import Session from "./Session";

function Sessions({ sessions, setSessions }) {
    return (
        <div className="bg-(--thirdary-color) basis-[40%] lg:basis-[30%] h-full overflow-auto py-5 px-3 transition-colors">
            <h1 className="font-bold text-3xl mb-3">Sessions</h1>
            <div className="flex gap-6 flex-col-reverse">
                {sessions.map((session, i) => (
                    <Session key={session._id} index={i} session={session} setSessions={setSessions} />
                ))}
            </div>
        </div>
    );
}

export default Sessions;

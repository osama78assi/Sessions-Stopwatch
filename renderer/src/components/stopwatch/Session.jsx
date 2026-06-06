import { LuSave } from "react-icons/lu";
import { TfiPencilAlt } from "react-icons/tfi";
import { useState } from "react";
import TimeRenderer from "./TimeRenderer";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function Session({ index, session, setSessions }) {
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(session.description ?? "");
    const [err, setErr] = useState("");

    return (
        <div className="bg-(--secondary-color) p-2 rounded-2xl transition-colors">
            <span className="font-DSEG7-bold text-2xl bg-(--thirdary-color) transition-colors p-2 rounded-lg">
                {index + 1}
            </span>

            <TimeRenderer time={session.duration} />

            {err ? (
                <span className="block my-2 ms-2 text-sm italic text-red-500">
                    {err}
                </span>
            ) : null}

            <div className="mt-3 max-h-[125]! lg:max-h-[200px]! overflow-auto">
                {isEditing ? (
                    <div className="flex w-full px-3 gap-4 h-full">
                        <Input.Textarea
                            value={desc}
                            placeholder="I studied topic X"
                            className="flex-1 min-h-[99px] lg:min-h-[200px] text-(--main-text-color) placeholder-(--thirdary-text-color) outline-none! bg-(--secondary-color)!"
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value.length > 500) {
                                    setErr(
                                        "The description can be 500 character maximum",
                                    );
                                    return;
                                }

                                setErr("");

                                setDesc(value);
                            }}
                            autoFocus
                        />

                        <div>
                            <Button
                                className={"h-fit sticky top-0"}
                                onClick={() => {
                                    setIsEditing(false);

                                    setSessions((sessions) =>
                                        sessions.map((ses) => {
                                            if (ses._id !== session._id) {
                                                return ses;
                                            }

                                            return {
                                                ...ses,
                                                description: desc,
                                            };
                                        }),
                                    );
                                }}
                            >
                                <LuSave />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        role="button"
                        className={`flex w-full px-3 gap-4  ${
                            !session?.description
                                ? "text-(--thirdary-text-color)"
                                : ""
                        }`}
                    >
                        <p className="flex-1 min-w-0 break-words">
                            {session?.description
                                ? session.description
                                : "Add description"}
                        </p>

                        <Button
                            className={"h-fit sticky top-0"}
                            onClick={() => {
                                setDesc(session.description ?? "");
                                setIsEditing(true);
                            }}
                        >
                            <TfiPencilAlt />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

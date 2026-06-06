import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { TfiPencilAlt } from "react-icons/tfi";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";
import { destroySession, updateSession } from "../../serivces/session";
import { updateStopwatch } from "../../serivces/stopwatch";
import { CATEGORY_OPTIONS } from "../../util/constants";
import CategoryInput from "../stopwatch/CategoryInput";
import toast from "react-hot-toast";

export default function ActionButton({ record, onDelete, onUpdated }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [editCategory, setEditCategory] = useState(
        record?.stopwatch?.category ?? "",
    );
    const [editDescription, setEditDescription] = useState(
        record?.description ?? "",
    );

    const [descErr, setDescErr] = useState("");

    async function handleSave() {
        setIsSaving(true);
        try {
            if (editCategory !== record?.stopwatch?.category) {
                await updateStopwatch(record.stopwatchId, {
                    category: editCategory,
                });
            }

            if (editDescription !== record?.description) {
                await updateSession(record.id, {
                    description: editDescription,
                });
            }

            onUpdated?.();
            setIsEditOpen(false);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteConfirm() {
        setIsDeleting(true);
        try {
            const res = await destroySession(record.id);

            if (res?.success) {
                toast.success(res?.message || "Deleted successfully");
                onDelete?.();
            } else {
                toast.error(res?.message || "Failed to delete");
            }
        } catch (err) {
            toast.error("Something went wrong, please try again");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div className="flex items-center gap-1">
                <Button
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-7 h-7 rounded flex justify-center items-center"
                    theme="danger"
                >
                    <BsTrash />
                </Button>

                <Button
                    onClick={() => setIsEditOpen(true)}
                    className="w-7 h-7 rounded flex items-center justify-center"
                >
                    <TfiPencilAlt />
                </Button>
            </div>

            {/* EDIT MODAL */}
            <Modal
                disable={isSaving}
                isOpen={isEditOpen}
                handleClose={() => setIsEditOpen(false)}
                title={"Update Sessions \\ Stopwatch"}
            >
                <div className="sm:w-[500px]">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-semibold text-(--main-interactive-color-v1)">
                            Edit Stopwatch
                        </h3>

                        <Dropdown
                            className="bg-(--secondary-color)!"
                            label="Select Category"
                            optionOptions={{ className: "p-2!" }}
                            menuOptions={{
                                className: "bg-(--thirdary-color)!",
                            }}
                            onSelect={({ option, forceClose }) => {
                                forceClose();
                                setEditCategory(option.value);
                            }}
                            options={CATEGORY_OPTIONS}
                        />

                        <div className="flex flex-col mt-1">
                            <label htmlFor="edit-category" className="text-lg">
                                In case not in the dropdown
                            </label>
                            <CategoryInput
                                id="edit-category"
                                className="bg-(--secondary-color)!"
                                defaultValue={editCategory}
                                handleChange={(e) =>
                                    setEditCategory(e.target.value)
                                }
                            />
                        </div>

                        <div className="mt-3">
                            <h3 className="text-lg font-semibold text-(--main-interactive-color-v1)">
                                Edit Session
                            </h3>

                            <div className="flex flex-col mt-1">
                                <label
                                    htmlFor="edit-description"
                                    className="text-lg"
                                >
                                    Description
                                </label>

                                <Input.Textarea
                                    id="edit-description"
                                    className="bg-(--secondary-color)! min-h-[150px] resize-none"
                                    value={editDescription}
                                    onChange={(e) => {
                                        if (e.target.value.length >= 500) {
                                            setDescErr(
                                                "The description can be 500 character maximum",
                                            );
                                            return;
                                        }
                                        setDescErr("");
                                        setEditDescription(e.target.value);
                                    }}
                                />

                                {descErr ? (
                                    <span className="block mt-1 ms-2 text-sm italic text-red-500">
                                        {descErr}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving…" : "Save"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* DELETE CONFIRM MODAL */}
            <Modal
                disable={isDeleting}
                isOpen={isDeleteOpen}
                handleClose={() => setIsDeleteOpen(false)}
                title="Confirm Delete"
            >
                <div className="sm:w-[420px] flex flex-col gap-4">
                    <p className="text-(--main-text-color)">
                        Are you sure you want to delete this session? This
                        action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            className="px-3 py-1"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            theme="danger"
                            className="px-3 py-1"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting…" : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

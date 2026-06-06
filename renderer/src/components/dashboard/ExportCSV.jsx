import toast from "react-hot-toast";
import { exportSessionsCSV, pickSaveCsvFile } from "../../serivces/session";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useState } from "react";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import Checkbox from "../ui/Checkbox";

export default function ExportCSV({ filters }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [formatTime, setFormatTime] = useLocalStorageState(
        "export-csv-format-time",
        false,
    );

    async function handleExportBackup() {
        try {
            const path = await pickSaveCsvFile();

            if (path === null) {
                return;
            }

            setIsExporting(true);

            // Export
            const res = await exportSessionsCSV(path, filters, { formatTime });

            if (res.success) {
                toast.success(res.message);
                setIsOpen(false);
            } else toast.error(res.message || "Something went wrong");
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <>
            <div className="mt-2">
                <Button
                    size="sm"
                    className={"px-3! py-2!"}
                    onClick={() => setIsOpen(true)}
                >
                    Export Data As CSV
                </Button>
            </div>
            <Modal
                disable={isExporting}
                isOpen={isOpen}
                title={
                    <h1 className="text-xl text-(--main-interactive-color-v1) font-semibold">
                        Export data
                    </h1>
                }
                handleClose={() => setIsOpen(false)}
            >
                <div>
                    <div className="flex flex-col gap-3">
                        <div>
                            <h2 className="text-lg">
                                Exporting the data based on the filters as CSV
                                file
                            </h2>

                            <div className="flex gap-2 mt-3">
                                <Checkbox
                                    value={formatTime}
                                    onChange={(v) => setFormatTime(v)}
                                />
                                <label className="text-md">Format time</label>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="p-2!"
                            onClick={handleExportBackup}
                            disabled={isExporting}
                        >
                            Select Backup Path
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

import SettingsGroup from "./SettingsGroup";
import SettingContainer from "./SettingContainer";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import {
    exportBackup,
    pickFile,
    pickSaveDbFile,
    restoreBackup,
} from "../../serivces/settings";
import { useState } from "react";
import LoadingOverlay from "../ui/LoadingOverlay";
import Modal from "../ui/Modal";
import { message } from "antd";

function BackupsSettings() {
    const [isExporting, setIsExporting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    async function handleExportBackup() {
        try {
            const path = await pickSaveDbFile();

            if (path === null) {
                return;
            }

            setIsExporting(true);
            try {
                // Export
                const successMsg = await exportBackup(path);


                if (successMsg) toast.success(successMsg);
            } catch (err) {
                toast.error(err?.message || "Something went wrong");
            } finally {
                setIsExporting(false);
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "Something went wrong");
        }
    }

    async function handleImportBackup() {
        try {
            setIsOpen(false);
            const path = await pickFile();

            if (path === null) {
                return;
            }

            setIsExporting(true);
            try {
                // Export
                const successMsg = await restoreBackup(path);

                if (successMsg) toast.success(successMsg);
            } catch (err) {
                toast.error("Something went wrong");
            } finally {
                setIsExporting(false);
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    }

    const className = "flex items-center justify-end h-full w-full";

    return (
        <SettingsGroup title="Backups">
            <LoadingOverlay isVisible={isExporting || isRestoring} />
            <SettingContainer
                title="Backup"
                description="Export a backup file for your database"
            >
                <div className={className}>
                    <Button
                        size="sm"
                        className="p-2!"
                        onClick={handleExportBackup}
                    >
                        Export Backup
                    </Button>
                </div>
            </SettingContainer>

            <SettingContainer
                title="Restore"
                description="Import a backup file to your database"
            >
                <div className={className}>
                    <Button
                        size="sm"
                        className="p-2!"
                        onClick={() => setIsOpen(true)}
                    >
                        Restore Backup
                    </Button>
                </div>
            </SettingContainer>

            <Modal
                title={
                    <h1 className="text-2xl text-(--main-interactive-color-v1)">
                        Restoring Database Backup
                    </h1>
                }
                isOpen={isOpen}
                handleClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-4">
                    <p className="text-lg text-red-500 font-bold">
                        You will lose all current data in your database, Are you
                        sure you want to restore ?
                    </p>
                    <Button
                        size="sm"
                        className="p-2!"
                        onClick={handleImportBackup}
                    >
                        Restore Backup
                    </Button>
                </div>
            </Modal>
        </SettingsGroup>
    );
}

export default BackupsSettings;

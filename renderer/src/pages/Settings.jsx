import BackupsSettings from "../components/settings/BackupsSettings";

function Settings() {
    return (
        <div className="px-2 py-3 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <div className="flex mb-6 mt-4 justify-between">
                    <h1 className="text-3xl text-(--main-interactive-color-v1)">
                        Settings
                    </h1>
                </div>
                <BackupsSettings /> 
            </div>
        </div>
    );
}

export default Settings;

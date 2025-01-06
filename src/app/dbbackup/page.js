"use client";

import { useState } from "react";

export default function BackupPage() {
    const [backupStatus, setBackupStatus] = useState("");

    const handleBackup = async () => {
        setBackupStatus("Backing up...");
        try {
            const response = await fetch("/api/dbbackup", {
                method: "POST",
            });

            if (response.ok) {
                const data = await response.json();
                setBackupStatus(`Backup successful! File saved at: ${data.filePath}`);
            } else {
                const errorData = await response.json();
                setBackupStatus(`Backup failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error during backup:", error);
            setBackupStatus("An unexpected error occurred during the backup.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Database Backup</h1>
            <button
                onClick={handleBackup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Backup Database
            </button>
            {backupStatus && <p className="mt-4 text-gray-700">{backupStatus}</p>}
        </div>
    );
}

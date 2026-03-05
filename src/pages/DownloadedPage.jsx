import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useSmartHome } from '../context/SmartHomeContext';

function DownloadedPage() {
    const { rooms } = useSmartHome();
    const [downloaded, setDownloaded] = useState([]);

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(rooms, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smarth-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded((prev) => [...prev, { name: a.download, time: new Date().toLocaleTimeString(), type: 'JSON' }]);
    };

    const exportCSV = () => {
        const lines = ['Room,Device,Status,Power,On/Off'];
        for (const [roomName, data] of Object.entries(rooms)) {
            for (const device of (data.devices || [])) {
                lines.push(`"${roomName}","${device.name}","${device.status}","${device.power}","${device.isOn ? 'On' : 'Off'}"`);
            }
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smarth-devices-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded((prev) => [...prev, { name: a.download, time: new Date().toLocaleTimeString(), type: 'CSV' }]);
    };

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <h2 className="text-[22px] font-bold text-text-white mb-2">Download & Export</h2>
            <p className="text-text-muted text-[13px] mb-6">Export your smart home data for analysis or backup</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* JSON export */}
                <button
                    onClick={exportJSON}
                    className="bg-bg-card rounded-2xl p-5 border border-border-line/60 text-left
                     hover:border-accent-blue/30 transition-all group"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-accent-blue/15 flex items-center justify-center
                            group-hover:scale-105 transition-transform">
                            <FileJson size={20} className="text-accent-blue" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-text-white">Export as JSON</h3>
                            <p className="text-[12px] text-text-muted">Full data including rooms, devices, lights</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-accent-blue text-[13px] font-medium">
                        <Download size={14} /> Download JSON
                    </div>
                </button>

                {/* CSV export */}
                <button
                    onClick={exportCSV}
                    className="bg-bg-card rounded-2xl p-5 border border-border-line/60 text-left
                     hover:border-accent-green/30 transition-all group"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-accent-green/15 flex items-center justify-center
                            group-hover:scale-105 transition-transform">
                            <FileSpreadsheet size={20} className="text-accent-green" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-text-white">Export as CSV</h3>
                            <p className="text-[12px] text-text-muted">Device list for spreadsheet analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-accent-green text-[13px] font-medium">
                        <Download size={14} /> Download CSV
                    </div>
                </button>
            </div>

            {/* Recent downloads */}
            {downloaded.length > 0 && (
                <div>
                    <h3 className="text-[15px] font-semibold text-text-white mb-3">Recent Downloads</h3>
                    <div className="space-y-2">
                        {downloaded.map((d, i) => (
                            <div key={i} className="bg-bg-card rounded-xl p-3 border border-border-line/40 flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-accent-green flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-text-white text-[12px] font-medium truncate">{d.name}</p>
                                    <p className="text-text-dark text-[11px]">{d.time}</p>
                                </div>
                                <span className="text-[11px] text-text-muted bg-bg-card-inner px-2 py-1 rounded-lg">{d.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DownloadedPage;

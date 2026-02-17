"use client";

import { useEffect, useState } from "react";

export default function HeadsUpDisplay() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Format time as hh:mm:ss A for IST (Indian Standard Time)
            const options: Intl.DateTimeFormatOptions = {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            };
            setTime(now.toLocaleTimeString("en-US", options));
        };

        updateTime(); // Initial call
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-40 flex h-full w-full flex-col justify-between p-6 mix-blend-difference text-white">
            {/* Top Bar */}
            <div className="flex w-full items-start justify-between">
                {/* Top Left: System Nominal */}
                <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-md px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-mono text-xs tracking-widest text-white">SYSTEM_NOMINAL</span>
                </div>

                {/* Top Right: Clock */}
                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-md px-4 py-2 font-mono text-xs tracking-widest text-white">
                    IST {time}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex w-full items-end justify-between">
                {/* Bottom Left: Coords */}
                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-md px-4 py-2 font-mono text-xs tracking-widest text-white">
                    COORDS: RANCHI
                </div>
            </div>
        </div>
    );
}

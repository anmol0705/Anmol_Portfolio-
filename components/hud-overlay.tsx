export default function HudOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex h-full w-full flex-col justify-between p-6 mix-blend-difference text-white">
            {/* Top Bar */}
            <div className="flex w-full justify-between items-start">
                <div className="font-mono text-xs tracking-widest opacity-50">
                    SYSTEM_READY
                </div>
                <div className="font-mono text-xs tracking-widest opacity-50">
                    V.1.0.0
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex w-full justify-between items-end">
                <div className="font-mono text-xs tracking-widest opacity-50">
                    COORDS: 0 0
                </div>
                <div className="font-mono text-xs tracking-widest opacity-50">
                    STATUS: ACTIVE
                </div>
            </div>
        </div>
    );
}

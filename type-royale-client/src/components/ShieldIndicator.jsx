import { Shield } from "lucide-react";

const ShieldIndicator = ({ active = false }) => {
    return (
        <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 shadow-md transition-all
        ${active
                    ? "bg-cyan-600/30 ring-2 ring-cyan-400 animate-pulse"
                    : "bg-gray-800"
                }
      `}
        >
            <Shield
                size={18}
                className={active ? "text-cyan-300" : "text-gray-400"}
            />

            <span
                className={`text-sm font-semibold ${active ? "text-cyan-200" : "text-gray-400"
                    }`}
            >
                {active ? "Shield Active" : "Shield Down"}
            </span>
        </div>
    );
};

export default ShieldIndicator;

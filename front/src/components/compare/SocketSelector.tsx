import { memo } from "react";
import { SocketSelectorProps } from "../../interface/compare";

const SocketSelector: React.FC<SocketSelectorProps> = ({ socket, setSocket, sockets }) => {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Сокет</label>
            <select
                value={socket}
                onChange={(e) => setSocket(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            >
                <option value="">Выберите сокет</option>
                {sockets.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default memo(SocketSelector);
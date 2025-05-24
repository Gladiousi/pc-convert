import { memo } from "react";
import { SocketSelectorProps } from "../../interface/compare";
import { Select } from "../common/Select";

const SocketSelector: React.FC<SocketSelectorProps> = ({ socket, setSocket, sockets, label = "Сокет" }) => {
  return (
    <Select
      label={label}
      value={socket}
      onChange={setSocket}
      options={sockets}
      placeholder="Выберите сокет"
    />
  );
};

export default memo(SocketSelector);
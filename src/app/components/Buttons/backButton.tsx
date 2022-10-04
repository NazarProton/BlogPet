import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router";

const BackHistoryButton = () => {
  const history = useNavigate();
  return (
    <Button
      style={{ color: "#1890ff", borderColor: "#1890ff" }}
      onClick={() => history(-1)}
    >
      <ArrowLeftOutlined />
      Назад
    </Button>
  );
};

export default BackHistoryButton;

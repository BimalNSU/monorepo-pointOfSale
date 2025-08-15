import { Button, Card, Avatar } from "antd";
import { DeleteOutlined, StarOutlined, StarFilled, MenuOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableCard = ({ fileObj, index, onRemove, onSetPrimary }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fileObj.uid,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        hoverable
        cover={
          <img
            src={fileObj.preview}
            alt={fileObj.name}
            style={{ height: 160, objectFit: "cover", cursor: "pointer" }}
          />
        }
        actions={[
          <Button
            type="text"
            icon={
              fileObj.isPrimary ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />
            }
            onClick={() => onSetPrimary(index)}
            disabled={fileObj.isPrimary}
          />,
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(index)} />,
          <MenuOutlined style={{ cursor: "move", fontSize: 18 }} />,
        ]}
      >
        <Card.Meta
          avatar={<Avatar src={fileObj.preview} />}
          title={fileObj.isPrimary ? "Primary Image" : "Secondary Image"}
          description={`Order: ${index + 1}`}
        />
      </Card>
    </div>
  );
};
export default SortableCard;

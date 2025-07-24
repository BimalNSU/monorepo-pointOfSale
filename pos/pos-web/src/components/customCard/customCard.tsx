import React from "react";
import styles from "./customCard.module.css";

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  titlePosition?: "left" | "center" | "right";
  icon?: React.ReactNode; // Optional icon beside the title
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  children,
  titlePosition = "left",
  icon,
}) => {
  return (
    <div className={styles.customCard}>
      <div className={`${styles.cardHeader} ${styles[titlePosition]}`}>
        {titlePosition === "left" && <div className={styles.preLine} />}
        {titlePosition !== "left" && <div className={styles.line} />}
        <span className={styles.cardTitle}>
          {title}
          {icon && <span style={{ marginLeft: 8 }}>{icon}</span>}
        </span>
        {titlePosition !== "right" && <div className={styles.line} />}
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
};

export default CustomCard;

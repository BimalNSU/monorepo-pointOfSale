import React from "react";
import styles from "./customCard.module.css";

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  titlePosition?: "left" | "center" | "right";
}

const CustomCard: React.FC<CustomCardProps> = ({ title, children, titlePosition = "left" }) => {
  return (
    <div className={styles.customCard}>
      <div className={`${styles.cardHeader} ${styles[titlePosition]}`}>
        {titlePosition !== "left" && <div className={styles.line} />}
        <span className={styles.cardTitle}>{title}</span>
        {titlePosition !== "right" && <div className={styles.line} />}
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
};

export default CustomCard;

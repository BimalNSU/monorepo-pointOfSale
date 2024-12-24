import jsPDF from "jspdf";
import "jspdf-autotable";
import { convertToBD } from "@/constants/currency";
import { INVOICE_STATUS } from "@/constants/paymentStatus";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import { convertToWords } from "./util";
import { Shop } from "@/db-collections/shop.collection";
import { Property } from "@/db-collections/property.collection";
import { Residential } from "@/db-collections/residential.collection";
import { useFetchImage } from "./fetchImage";

const defaultFontName = "helvetica";

const PDFGenerator = ({ invoiceData, previousDue, finalTotal, invoiceTableData }) => {
  const db = useFirestore();
  const [propertyData, setPropertyData] = useState(null);
  const [residentialData, setResidentialData] = useState();
  const [shopData, setShopData] = useState();
  const [partialPayment, setPartialPayment] = useState("");

  const fetchData = async () => {
    try {
      const propertyId = invoiceData.propertyId;
      const propertyObj = new Property(db);
      const propertyData = await propertyObj.get(propertyId);
      setPropertyData(propertyData);

      const unitIds = invoiceData.unitIds;
      const shopIds = invoiceData.shopIds;
      if (unitIds?.length) {
        const residentialObj = new Residential(db, propertyId);
        const nResidentialData = await residentialObj.get(unitIds[0]);
        setResidentialData(nResidentialData);
      }
      if (shopIds?.length) {
        const shopObj = new Shop(db, propertyId);
        const nShopData = await shopObj.get(shopIds[0]);
        setShopData(nShopData);
      }

      if (invoiceData.status === INVOICE_STATUS.VALUES.Partial) {
        const totalPayment = Object.values(invoiceData.payments).reduce(
          (total, payment) => total + payment,
          0,
        );
        const formattedPayment = totalPayment.toFixed(2);
        setPartialPayment(formattedPayment);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invoiceData]);

  const imgURL = propertyData?.propertyImage;
  const base64 = useFetchImage(imgURL);

  if (!imgURL) {
    return null;
  }

  const downloadPDF = async () => {
    const imgPDFPath = base64;
    const doc = new jsPDF();
    const initialPosition = { x: 9, y: 60 };
    const verticalLineGap = 7;
    const boxGap = 125;
    const leftBoxPos = {
      x: initialPosition.x + verticalLineGap,
      y: initialPosition.y + verticalLineGap,
      innerGap: 30,
    };
    const rightBoxPos = {
      x: initialPosition.x + boxGap,
      y: initialPosition.y + verticalLineGap,
      innerGap: 60,
    };

    const imageCords = [25, 20, 35, 35];
    const imageFormat = "PNG";
    doc.addImage(imgPDFPath, imageFormat, ...imageCords);

    doc.setFillColor("#71bd44");

    const triangleCords = [110, 0, 110, 15, 90, 0];
    const triangleColor = "F";
    doc.triangle(...triangleCords, triangleColor);

    const rectangleCords = [110, 0, 100, 15];
    const rectangleColor = "F";
    doc.rect(...rectangleCords, rectangleColor);

    let address = `${propertyData.address.village_road}, ${propertyData.address.block_sector_area}, ${propertyData.address.division_state} - ${propertyData.address.postOffice}`;
    let textX;
    let textY;

    if (address.length > 20) {
      textX = 80;
      textY = 42;
    } else {
      textX = 90;
      textY = 42;
    }

    const propertyName = propertyData.name;
    doc.setFont(defaultFontName, "bold");
    doc.setFontSize(21);
    let yPos = 35;
    doc.text(propertyName, 70, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.setFont(defaultFontName, "bold");
    doc.text(address, textX, textY);

    doc.setFontSize(12);
    doc.text("INVOICE", 103, 48);

    doc.setFontSize(10);
    doc.setFont(defaultFontName, "bold");

    const leftBox = [
      { label: "Invoice No: ", value: invoiceData.aliasId || invoiceData.id },
      { label: "Bill To: ", value: invoiceData.targetUserName },
      { label: "Issue Date: ", value: invoiceData.issuedAt },
      { label: "Due Date: ", value: invoiceData.dueDate },
      { label: "Invoice period: ", value: invoiceData.month },
    ];

    if (residentialData) {
      leftBox.splice(2, 0, { label: "Unit No:", value: residentialData.unitNo });
      leftBox.splice(3, 0, { label: "Unit Size:", value: `${residentialData.unitSize}` });
    }
    if (shopData) {
      leftBox.splice(2, 0, { label: "Shop No:", value: shopData.no });
      leftBox.splice(3, 0, { label: "Shop Size:", value: `${shopData.size}` });
    }

    leftBox.forEach((data) => {
      doc.setFont(defaultFontName, "bold");
      if (data.value) {
        doc.text(data.label, leftBoxPos.x, leftBoxPos.y);
        doc.setFont(defaultFontName, "normal");
        doc.text(data.value, leftBoxPos.x + leftBoxPos.innerGap, leftBoxPos.y);
        leftBoxPos.y += verticalLineGap;
      }
    });

    const paymentStatus = INVOICE_STATUS.KEYS[invoiceData.status].text;

    const rigthBox = [
      { label: "Previous Due Amount: ", value: previousDue },
      { label: "Discount: ", value: invoiceData.discount },
      { label: "Total Current charges: ", value: invoiceData.currentTotal },
      { label: "Total Due Amount: ", value: finalTotal },
      { label: "Payment Status: ", value: paymentStatus },
    ];

    //"partial" = 2
    if (invoiceData.status === INVOICE_STATUS.VALUES.Partial) {
      const label = "Partial Payment: ";
      const value = partialPayment;
      rigthBox.push({ label, value });
    }

    rigthBox.forEach(({ label, value }) => {
      if (label !== "Discount: " || (label === "Discount: " && value > 0)) {
        doc.setFont(defaultFontName, "bold");
        doc.text(label, rightBoxPos.x, rightBoxPos.y);
        doc.setFont(defaultFontName, "normal");
        doc.text(
          typeof value === "number" ? convertToBD(value) : value,
          rightBoxPos.x + rightBoxPos.innerGap,
          rightBoxPos.y,
          { align: "right" },
        );
        rightBoxPos.y += verticalLineGap;
      }
    });

    if (invoiceTableData.length > 0) {
      const center = doc.internal.pageSize.width / 2;

      doc.setFontSize(16);
      doc.setFont(defaultFontName, "bold");
      const yAxis = leftBoxPos.y > rightBoxPos.y ? leftBoxPos.y : rightBoxPos.y;
      doc.text("Invoice Summary", center, yAxis, { align: "center" });

      const tableYaxis = yAxis + 5;

      const columns = [
        { title: "#", dataKey: "key" },
        { title: "Description", dataKey: "name" },
        { title: "Amount (BDT)", dataKey: "amount" },
      ];

      const data = invoiceTableData.map((item) => ({
        key: item.key,
        name: item.name,
        amount: convertToBD(item.amount),
      }));

      const headerStyles = {
        fillColor: "#71bd44",
        textColor: "#000",
        fontStyle: "bold",
      };

      const totalAmount = invoiceTableData.reduce((acc, item) => acc + item.amount, 0);
      let totalAmountFormatted = convertToBD(totalAmount);

      data.push({ key: "", name: "", amount: "" });

      const totalIndex = data.findIndex((item) => item.name === "");

      data[totalIndex].name = { content: "Total", styles: { halign: "center", fontStyle: "bold" } };
      data[totalIndex].amount = { content: totalAmountFormatted, styles: { halign: "right" } };

      const amountColumnWidth = 28;

      doc.autoTable({
        columns,
        body: data,
        startY: tableYaxis,
        headStyles: headerStyles,
        margin: { left: 15 },
        columnStyles: {
          amount: { cellWidth: amountColumnWidth, halign: "right" },
        },
        didDrawPage: function (data) {
          doc.setFontSize(10);
          const inWordYaxis = data.cursor.y + 5;
          const convertText = "In Words: ";
          const totalAmountInWords = `(${convertText} ${convertToWords(totalAmountFormatted)})`;
          doc.text(totalAmountInWords, 15, inWordYaxis);
        },
      });

      const footerHeight = 100;
      const remainingHeight = doc.internal.pageSize.height - doc.previousAutoTable.finalY;
      if (remainingHeight < footerHeight) {
        doc.addPage();
      }
    }

    const infoText1 = "Terms & Conditions:";
    const infoText2 = "1. Payment last date: ";
    const infoText3 =
      "2. If any bill is less or extra that amount will be adjusted in the next month";
    const infoText4 =
      "3. If payment is made after due date 4% will be charged on rent and 5% will be charged on water bill.";
    const infoText5 =
      "4. Sena Kalyan Sanstha is a welfare organization, cooperate in welfare work by paying rent and other bills on time and stay free of late fee.";

    const extraInformation = [
      { value: infoText1 },
      { value: infoText2 + invoiceData?.dueDate || "" },
      { value: infoText3 },
      { value: infoText4 },
      { value: infoText5 },
    ];

    let footerYPosition = 210;

    doc.setFont(defaultFontName, "normal");
    doc.setFontSize(8);

    extraInformation.forEach(({ value }) => {
      doc.text(value, 15, footerYPosition);
      footerYPosition += 5;
    });

    const footerTexts = [
      {
        value: "This is an auto-generated invoice. No signature is required.",
        x: 65,
        y: 270,
        fontStyle: "bold",
      },
      { value: "Powered by Bulbuli.XYZ", x: 90, y: 275 },
      { value: "©2022 Created by CDPRC", x: 88, y: 280 },
    ];

    doc.setFontSize(8);

    footerTexts.forEach(({ value, x, y, fontStyle }) => {
      if (fontStyle === "bold") {
        doc.setFont(defaultFontName, "bold");
      } else {
        doc.setFont(defaultFontName, "normal");
      }
      doc.text(value, x, y);
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  return (
    <Button
      style={{ background: "#71bd44", color: "#FFF" }}
      onClick={downloadPDF}
      icon={<DownloadOutlined />}
    >
      Download PDF
    </Button>
  );
};

export default PDFGenerator;

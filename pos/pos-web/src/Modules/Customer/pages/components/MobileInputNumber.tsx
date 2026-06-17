import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/types.cjs";

export const validatePhoneNumber = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error("Phone number is required"));
  }
  if (!isValidPhoneNumber(value)) {
    return Promise.reject(new Error("Invalid phone number"));
  }
  return Promise.resolve();
};

interface MobileNumberInputProps {
  value?: string;
  onChange?: (value?: string) => void; // Form passes string
}

export const MobileNumberInputAntd: React.FC<MobileNumberInputProps> = ({ value, onChange }) => {
  // Cast the onChange to the type PhoneInput expects
  const handleChange = (val?: E164Number) => {
    onChange?.(val as string | undefined);
  };

  return (
    <PhoneInput
      // style={{ width: "100%", display: "flex", gap: "8px" }}
      placeholder="Enter phone number"
      defaultCountry="BD"
      international
      value={value as E164Number | undefined} // cast string -> E164Number
      onChange={handleChange} // cast function
    />
  );
};

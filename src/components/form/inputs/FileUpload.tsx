import React from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'

import './FileUpload.css';

const fileTypes = ["csv"];

type CustomFormItemProps = {
  value?: any;
  onChange?: (val: any) => void
};

export const FileUpload: React.FC<CustomFormItemProps> = ({ value, onChange }: CustomFormItemProps) => {

  const handleChange = (file: any) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }: any) => onChange!(data)
    });
  };

  return (
    <div className="file-upload-wrapper">
      <div className="file-upload-title">
        Follow instructions in the template and upload the file
      </div>
      <div className="file-upload-template">
        <FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon> Template.csv
      </div>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="Drag & drop your file here" />
    </div>
  );
}

export default FileUpload;
import React, { useState } from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'

import './FileUpload.css';

const fileTypes = ["csv"];

function FileUpload() {
  const handleChange = (file: any) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        console.log(results.data)
      },
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
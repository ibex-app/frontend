import React, { useState } from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";

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
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default FileUpload;
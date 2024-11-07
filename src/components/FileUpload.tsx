"use client"; // Add this directive at the top of the file

import { useState } from "react";
import axios from "axios";
interface AxiosResponse {
  message: string;
  error?: string;
  ok: boolean;
  body: any;
  headers: any;
}
const FileUpload = () => {
  //initial state
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    const response: AxiosResponse = await axios.post(
      "/pages/api/upload/route",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("This is the response: ", response);
    //use a ui for the user to idicate that the upload has failed.
    if (!response.ok) {
      alert("Upload failed");
      setIsUploading(false);
      return;
    }

    const reader = response.body?.getReader();
    const contentLength = Number(response.headers.get("Content-Length"));

    if (reader && contentLength) {
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedLength += value.length;
        setUploadProgress((receivedLength / contentLength) * 100);
      }
    }

    alert("File uploaded successfully");
    setIsUploading(false);
  };

  const formStyle = {
    backgroundColor: "white",
    height: "70vh",
    width: "70vw",
    borderRadius: "20px",
    padding: "1rem",
  }

  return (
    <form
      onSubmit={handleUpload}
      style={formStyle}
    >
      <h1>Upload Files</h1>
      <div></div>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "UPLOAD"}
      </button>
      {isUploading && (
        <div>
          <progress value={uploadProgress} max="100"></progress>
          <span>{Math.round(uploadProgress)}%</span>
        </div>
      )}
    </form>
  );
};

export default FileUpload;

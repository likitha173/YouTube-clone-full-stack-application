import "./dragdrop.css";
import { FaCloudUploadAlt, FaVideo } from "react-icons/fa";
import { useState } from "react";

export default function DragDropFiles({ file, setFile, selectedVideo }) {
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("video/")) {
        alert("Please select a valid video file.");
        e.target.value = ''; // Reset the input
        return;
      }

      setProcessing(true);
      setTimeout(() => {
        console.log("Setting file:", selectedFile.name);
        setFile(selectedFile);
        setProcessing(false);
      }, 100);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Upload button clicked");
    const fileInput = document.getElementById('upload-video');
    console.log("File input found:", fileInput);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      console.log("File dropped:", droppedFile);

      if (droppedFile.type.startsWith("video/")) {
        setProcessing(true);
        setTimeout(() => {
          setFile(droppedFile);
          setProcessing(false);
        }, 100);
      } else {
        alert("Please select a valid video file.");
      }
    }
  };

  return (
    <div
      className={`drag-drop-area ${dragOver ? 'dragover' : ''}`}
      onDragOver={handleDrag}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drag-drop-content">
        <FaCloudUploadAlt className="upload-icon" />

        {processing ? (
          <div className="loading-content">
            <div className="loading-text">Processing file...</div>
          </div>
        ) : (file || selectedVideo) ? (
          <div className="file-selected">
            <FaVideo style={{ fontSize: '24px', color: 'var(--text-secondary)', marginBottom: '8px' }} />
            <div className="drag-drop-text">
              {file ? file.name : selectedVideo?.videoUrl || "Video selected"}
            </div>
            <div className="drag-drop-subtext">
              {file ? `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Ready to upload"}
            </div>
          </div>
        ) : (
          <>
            <div className="drag-drop-text">Drag and drop video files to upload</div>
            <div className="drag-drop-subtext">
              Your videos will be private until you publish them.
            </div>
          </>
        )}

        <input
          type="file"
          id="upload-video"
          accept="video/*"
          className="file-input"
          onChange={handleFile}
          disabled={processing}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="upload-button"
          onClick={handleButtonClick}
          disabled={processing}
        >
          {processing ? "Processing..." : (file || selectedVideo) ? "CHANGE VIDEO" : "SELECT FILES"}
        </button>
      </div>
    </div>
  );
}

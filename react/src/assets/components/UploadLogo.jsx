import React, { useEffect, useState } from "react";

function UploadLogo() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("NOT UPLOADED");
  const [logoPath, setLogoPath] = useState(null);
  const [response, setResponse] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (file) {
      console.log("Uploading file...");
      setUploadStatus("Uploading File...");
      const formData = new FormData();
      formData.append("logoImage", file);
      try {
        setResponse("uploading..");
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch(
          `http://localhost:3000/api/logos/upload?username=${username}`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!result.ok) {
          setUploadStatus("Error In Uploading File...");
        } else {
          setUploadStatus("Uploaded Successfully...");
        }
        const data = await result.json();

        console.log(data);
        setResponse(data);
        setLogoPath(data.logo_path);
      } catch (error) {
        setUploadStatus("Error In Uploading File");
        console.error(error);
      }
    }
  };
  return (
    <>
      <div className="sidebar-child">
        <div className="inner-sidebar-child">
          <h1>Create New Logo</h1>

          <input
            id="logo-file"
            className="btn login-button"
            type="file"
            onChange={handleFileChange}
          />

          {file && (
            <button className="btn login-button" onClick={handleUpload}>
              Add Logo
            </button>
          )}
          {response && (
            <>
              <p className="upload-logo-status">{uploadStatus}</p>
            </>
          )}
          {logoPath && (
            <>
              <div className="logo-image-new">
                <img src={logoPath} alt="logo-img" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UploadLogo;

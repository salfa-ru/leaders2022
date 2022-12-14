import axios from "axios";
import React, { useRef, useState } from "react";
import { sendFileAPI } from "../../utils/API";
import { Button } from "../ui/button/Button";
import style from "./sendFile.module.scss";

export const SendFile = ({ onSelectPatient, setModals }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const buttonRef = useRef();

  const handleChange = (event) => {
    console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
    setFileList(event.target.files);
  };

  const onClickButton = () => {
    buttonRef.current.click();
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("media_file", selectedFile);

    axios
      .post("http://92.255.110.75:8000/api/v1/research/", formData, {
        headers: {
          "Content-type": "multipart/form-data",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let { data } = res;
        data.file = selectedFile;
        data.fileList = fileList;
        setUploaded(true);

        onSelectPatient(data);
      })
      .catch((err) => {
        console.log(err);
        setModals({
          modal: "error",
          message: err,
        });
      });

    //const result = await res.json();
  };

  return (
    <div className="SendFile">
      <input
        type="file"
        onChange={handleChange}
        ref={buttonRef}
        //accept="image/*,.png,.jpg,.gif"
        className={style.hidden}
      />

      {!selectedFile ? (
        <Button title="Загрузить" download={true} click={onClickButton} />
      ) : (
        <Button title="Отправить" download={true} click={handleUpload} />
      )}
    </div>
  );
};

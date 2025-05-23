import React, { useState } from "react";
import { mediaService } from "../services/mediaService";
import "./css/MediaUploader.css";

const MediaUploader = ({ onUploadSuccess, onError }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            onError("Пожалуйста, выберите файлы для загрузки");
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const uploadedMedia = [];
            const total = selectedFiles.length;

            // Загружаем файлы последовательно
            for (let i = 0; i < total; i++) {
                const file = selectedFiles[i];

                try {
                    const mediaData = await mediaService.uploadMedia(file, `Загружено для поста: ${file.name}`, ["post", "upload"]);

                    uploadedMedia.push({
                        id: mediaData.id,
                        filename: mediaData.originalFilename,
                        url: mediaData.url,
                        type: mediaData.mediaType,
                    });

                    // Обновляем прогресс
                    const progressPercent = Math.round(((i + 1) / total) * 100);
                    setProgress(progressPercent);
                } catch (fileError) {
                    console.error(`Ошибка при загрузке файла ${file.name}:`, fileError);
                    // Продолжаем загрузку других файлов
                }
            }

            // Если хотя бы один файл загружен успешно
            if (uploadedMedia.length > 0) {
                onUploadSuccess(uploadedMedia);
                setSelectedFiles([]);
            } else {
                onError("Не удалось загрузить ни один файл. Пожалуйста, попробуйте снова.");
            }
        } catch (error) {
            console.error("Error uploading media:", error);
            onError("Ошибка при загрузке файлов. Пожалуйста, попробуйте снова.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="media-uploader">
            <div className="file-input-container">
                <input type="file" multiple onChange={handleFileChange} className="file-input" disabled={uploading} accept="image/*,video/*" />
                <div className="file-input-label">{selectedFiles.length > 0 ? `Выбрано файлов: ${selectedFiles.length}` : "Выберите файлы для загрузки"}</div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="selected-file">
                            <span>{file.name}</span>
                            <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary clear-btn" onClick={() => setSelectedFiles([])} disabled={uploading}>
                        Очистить
                    </button>
                </div>
            )}

            {uploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-text">{progress}%</div>
                </div>
            )}

            <button className="btn btn-primary upload-btn" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
                {uploading ? "Загрузка..." : "Загрузить файлы"}
            </button>
        </div>
    );
};

export default MediaUploader;

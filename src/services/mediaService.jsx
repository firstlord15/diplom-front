import axios from "axios";

export const mediaService = {
    // Загрузка медиа-файла
    uploadMedia: async (file, description = null, tags = []) => {
        const formData = new FormData();

        // Добавляем файл
        formData.append("file", file);

        // Создаем метаданные и конвертируем в Blob
        const metadataObj = {
            description: description || `Файл: ${file.name}`,
            tags: tags.length > 0 ? tags : ["post"],
        };

        // Создаем Blob из JSON строки с правильным MIME типом
        const metadataBlob = new Blob([JSON.stringify(metadataObj)], { type: "application/json" });

        // Добавляем метаданные как Blob
        formData.append("metadata", metadataBlob);

        try {
            const response = await axios.post("/media-storage-service/media/files", formData);
            return response.data;
        } catch (error) {
            console.error("Error uploading media file:", error);
            throw error;
        }
    },
};

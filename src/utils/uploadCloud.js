import axios from "axios"

export const uploadMultipleToCloudinary = async (files) => {
    console.log('files', files)
    try {
        const uploadPromises = files.map(async (files) => {
            const formData = new FormData();
            formData.append('file', files);
            formData.append('upload_preset', 'cc22-ALittleBid-upload');

            const resp = await axios.post(
                'https://api.cloudinary.com/v1_1/tassanan/image/upload',
                formData
            );
            return resp.data.secure_url;
        });
        const urls = await Promise.all(uploadPromises);
        return urls; // จะได้ Array ของ URL เช่น ["url1", "url2"]
        //    const formData = new FormData()
        //    formData.append('file', file) //'file & 'upload_preset' บังคับต้องเป็นคำนี้ เพราะใน cloudinary ต้องการ
        //    formData.append('upload_preset', 'cc22-ALittleBid-upload')
        //    const resp = await axios.post('https://api.cloudinary.com/v1_1/tassanan/image/upload', formData)
        //    console.log('uploadCloud : resp', resp.data)
        //    return resp.data.secure_url
        console.log('cloudinary-urls', urls)
    } catch (err) {
        console.error("Upload Error:", err);
        throw err;
    }
}
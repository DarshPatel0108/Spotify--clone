const { ImageKit } = require("@imagekit/nodejs");

let ImageKitClient = null;

function getImageKitClient() {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
        throw new Error("ImageKit credentials are not configured. Set IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY and IMAGEKIT_URL_ENDPOINT in your environment before uploading files.");
    }

    if (!ImageKitClient) {
        ImageKitClient = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });
    }

    return ImageKitClient;
}

async function uploadFile(file) {
    const client = getImageKitClient();
    const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file, "base64");

    const result = await client.files.upload({
        file: fileBuffer,
        fileName: "music_" + Date.now(),
        folder: "yt-complete-backend/music",
    });

    return result;
}

module.exports = { uploadFile };
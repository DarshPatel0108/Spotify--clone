const fs = require("fs");
const path = require("path");
const { ImageKit } = require("@imagekit/nodejs");

let ImageKitClient = null;
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

function ensureUploadDir() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
}

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

function getFileBuffer(file) {
    if (Buffer.isBuffer(file)) {
        return file;
    }

    if (file && Buffer.isBuffer(file.buffer)) {
        return file.buffer;
    }

    if (typeof file === "string") {
        return Buffer.from(file, "base64");
    }

    throw new Error("Unsupported file payload.");
}

function getOriginalFileName(file) {
    if (file && typeof file.originalname === "string" && file.originalname.trim()) {
        return file.originalname;
    }

    return `music_${Date.now()}`;
}

function buildLocalUrl(fileName) {
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${baseUrl}/uploads/${fileName}`;
}

async function uploadFile(file) {
    const fileBuffer = getFileBuffer(file);

    if (process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
        try {
            const client = getImageKitClient();
            const result = await client.files.upload({
                file: fileBuffer,
                fileName: `music_${Date.now()}`,
            });

            return result;
        } catch (error) {
            console.warn("ImageKit upload failed, falling back to local storage:", error.message);
        }
    }

    ensureUploadDir();

    const originalName = getOriginalFileName(file);
    const extension = path.extname(originalName) || ".mp3";
    const sanitizedBaseName = originalName
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "") || "music";
    const fileName = `${Date.now()}-${sanitizedBaseName}${extension.startsWith(".") ? extension : `.${extension}`}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
        url: buildLocalUrl(fileName),
        fileName,
        type: "local",
    };
}

module.exports = { uploadFile };
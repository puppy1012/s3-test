import {
    S3Client,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    _Object as S3Object,
} from "@aws-sdk/client-s3";


export const REGION = process.env.REACT_APP_S3_REGION!;
export const BUCKET = process.env.REACT_APP_S3_BUCKET!;
const ACCESS_KEY = process.env.REACT_APP_S3_ACCESS_KEY!;
const SECRET_KEY = process.env.REACT_APP_S3_SECRET_KEY!;


export const s3 = new S3Client({
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});


export const isImageFile = (filename: string) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filename || "");
export const publicUrlOf = (key: string) =>
    `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;


export const formatBytes = (bytes?: number) => {
    if (bytes == null) return "-";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
export const formatKST = (dt?: Date) => (dt ? new Date(dt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }) : "-");


export type { S3Object };
export { ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand };



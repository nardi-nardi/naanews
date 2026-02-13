import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

// Validasi environment variables
const DO_SPACES_KEY = process.env.DO_SPACES_KEY;
const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET;
const DO_SPACES_BUCKET = process.env.DO_SPACES_BUCKET;
const DO_SPACES_REGION = "sgp1";
const DO_SPACES_ENDPOINT = `https://${DO_SPACES_REGION}.digitaloceanspaces.com`;

if (!DO_SPACES_KEY || !DO_SPACES_SECRET || !DO_SPACES_BUCKET) {
  console.error("❌ Missing DigitalOcean Spaces credentials");
}

// Initialize S3 client untuk DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: DO_SPACES_ENDPOINT,
  region: DO_SPACES_REGION,
  credentials: {
    accessKeyId: DO_SPACES_KEY || "",
    secretAccessKey: DO_SPACES_SECRET || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    // Validasi credentials
    if (!DO_SPACES_KEY || !DO_SPACES_SECRET || !DO_SPACES_BUCKET) {
      return NextResponse.json(
        { error: "Server configuration error: Missing DO Spaces credentials" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { filename, contentType } = body;

    // Validasi input
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    // Validasi tipe file (hanya image)
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique filename dengan timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${timestamp}-${sanitizedFilename}`;

    // Generate presigned URL untuk upload (valid selama 5 menit)
    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: "public-read", // Make file publicly accessible
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    // Public URL setelah upload sukses
    const publicUrl = `https://${DO_SPACES_BUCKET}.${DO_SPACES_REGION}.digitaloceanspaces.com/${key}`;

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

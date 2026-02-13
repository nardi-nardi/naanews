# Image Upload Feature - DigitalOcean Spaces Integration

## Overview
Fitur upload gambar menggunakan **DigitalOcean Spaces** (S3-compatible) dengan pendekatan **presigned URL** yang aman dan production-ready.

## Features
✅ Presigned URL approach (no secret keys in frontend)  
✅ Direct upload to DigitalOcean Spaces  
✅ File type validation (images only)  
✅ File size validation (max 2MB)  
✅ Upload progress indicator  
✅ Image preview  
✅ Reusable component  
✅ Clean error handling  

---

## Setup Instructions

### 1. Install Dependencies
Sudah terinstall otomatis:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Create DigitalOcean Space

1. Login ke [DigitalOcean](https://cloud.digitalocean.com/)
2. Buka **Spaces** dari sidebar
3. Klik **Create Space**
4. Pilih region: **Singapore (sgp1)**
5. Pilih CDN: Enabled (optional, recommended)
6. Set bucket name (contoh: `naanews-uploads`)
7. Set File Listing: **Public** atau **Private** (pilih Public agar file bisa diakses)
8. Klik **Create Space**

### 3. Generate Access Keys

1. Di DigitalOcean dashboard, buka **API** → **Spaces Keys**
2. Klik **Generate New Key**
3. Berikan nama (contoh: `naanews-upload`)
4. Copy **Access Key** dan **Secret Key**
5. **PENTING**: Save secret key sekarang, tidak akan ditampilkan lagi!

### 4. Configure Environment Variables

Edit file `.env.local`:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_KEY=your_spaces_access_key_here
DO_SPACES_SECRET=your_spaces_secret_key_here
DO_SPACES_BUCKET=your_bucket_name_here
```

**Example:**
```env
DO_SPACES_KEY=DO00ABCDEFGHIJKLMNOP
DO_SPACES_SECRET=xyzABC123secretKEY456randomSTRING789
DO_SPACES_BUCKET=naanews-uploads
```

### 5. Set Bucket Permissions (CORS)

Agar upload dari browser bisa bekerja, set CORS di bucket:

1. Di DigitalOcean Spaces, pilih bucket Anda
2. Klik tab **Settings**
3. Scroll ke **CORS Configurations**
4. Tambahkan config berikut:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

Atau untuk production (lebih aman):
```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://yourdomain.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

### 6. Test Upload

1. Restart dev server:
   ```bash
   npm run dev
   ```

2. Buka admin panel: `http://localhost:3000/admin`
3. Create or edit Feed/Book
4. Upload gambar menggunakan tombol "Upload Gambar"
5. Gambar akan tersimpan di DigitalOcean Spaces dan URL public akan otomatis terisi

---

## How It Works

### Upload Flow

```
1. User selects image file
   ↓
2. Frontend validates file (type & size)
   ↓
3. Request presigned URL from API route
   ↓
4. API route generates presigned URL (valid 5 minutes)
   ↓
5. Frontend uploads directly to DigitalOcean Spaces using presigned URL
   ↓
6. On success, public URL saved to form
   ↓
7. User submits form with image URL
   ↓
8. Image URL saved to MongoDB
```

### Security Benefits

✅ **No secret keys in frontend** - Secrets only in server-side API route  
✅ **Presigned URL expires** - URL only valid for 5 minutes  
✅ **Direct upload** - File doesn't pass through your server  
✅ **File validation** - Type and size checked before upload  

---

## File Structure

```
app/
├── api/
│   └── upload/
│       └── presigned-url/
│           └── route.ts          # Generate presigned URL
├── components/
│   └── image-upload.tsx          # Reusable upload component
└── admin/
    ├── feed/
    │   ├── new/page.tsx          # Uses ImageUpload
    │   └── [id]/page.tsx         # Uses ImageUpload
    └── book/
        ├── new/page.tsx          # Uses ImageUpload
        └── [id]/page.tsx         # Uses ImageUpload
```

---

## Component Usage

```tsx
import { ImageUpload } from "@/app/components/image-upload";

// In your form component
<ImageUpload
  currentImageUrl={form.image}
  onUploadComplete={(url) => setForm((p) => ({ ...p, image: url }))}
  label="Cover Image"
  buttonText="Upload Gambar"
/>
```

**Props:**
- `currentImageUrl`: Current image URL (untuk preview)
- `onUploadComplete`: Callback saat upload selesai, menerima public URL
- `label`: Label di atas upload button (optional)
- `buttonText`: Text di upload button (optional)

---

## API Endpoint

### POST `/api/upload/presigned-url`

**Request:**
```json
{
  "filename": "my-image.jpg",
  "contentType": "image/jpeg"
}
```

**Response:**
```json
{
  "presignedUrl": "https://sgp1.digitaloceanspaces.com/naanews-uploads/uploads/1234567890-my-image.jpg?...",
  "publicUrl": "https://naanews-uploads.sgp1.digitaloceanspaces.com/uploads/1234567890-my-image.jpg",
  "key": "uploads/1234567890-my-image.jpg"
}
```

---

## Validations

### File Type
- ✅ Allowed: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, etc.
- ❌ Rejected: PDF, video, documents, etc.

### File Size
- ✅ Maximum: 2MB
- ❌ Larger files will be rejected with error message

---

## Troubleshooting

### Upload fails with CORS error
**Solution:** Check CORS configuration di bucket settings (langkah 5 di atas)

### "Server configuration error"
**Solution:** Pastikan environment variables sudah diset dengan benar di `.env.local`

### Upload stuck at "Uploading..."
**Solution:** 
1. Check internet connection
2. Verify bucket permissions (should be Public)
3. Check browser console for errors

### Image uploaded but doesn't show
**Solution:** 
1. Verify bucket File Listing is set to Public
2. Check CDN settings (might need time to propagate)
3. Try accessing image URL directly di browser

---

## Production Deployment

### Vercel
Tambahkan environment variables di Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `DO_SPACES_KEY`
   - `DO_SPACES_SECRET`
   - `DO_SPACES_BUCKET`
3. Redeploy

### Custom Domain for Spaces (Optional)
1. Di DigitalOcean Spaces, pilih bucket
2. Go to Settings → Custom Subdomain
3. Set subdomain (contoh: `cdn.naanews.com`)
4. Update DNS records sesuai instruksi
5. Update code untuk gunakan custom domain

---

## Cost Estimation

DigitalOcean Spaces pricing (as of 2024):
- **Storage**: $5/month for 250GB
- **Bandwidth**: $0.01/GB after first 1TB
- **Cheap and predictable** for small-medium apps

---

## Alternative: CDN Setup

Untuk performance lebih baik, enable CDN:

1. Saat create Space, enable CDN
2. DigitalOcean automatically creates CDN endpoint
3. Use CDN URL instead of direct URL:
   ```
   Direct: naanews-uploads.sgp1.digitaloceanspaces.com
   CDN:    naanews-uploads.sgp1.cdn.digitaloceanspaces.com
   ```

Update API route untuk gunakan CDN URL di response.

---

## Support

Jika ada masalah:
1. Check DO Spaces documentation: https://docs.digitalocean.com/products/spaces/
2. Verify environment variables
3. Check browser console untuk error details
4. Review CORS configuration

---

**Happy uploading! 🚀**

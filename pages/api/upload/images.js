// pages/api/upload/images.js
import { IncomingForm } from 'formidable';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const userId = fields.userId[0];
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const uploadedFiles = [];
      const fileArray = Array.isArray(files.files) ? files.files : [files.files];

      for (const file of fileArray) {
        if (!file) continue;

        try {
          // Read the uploaded file
          const fileBuffer = fs.readFileSync(file.filepath);
          
          // Get image metadata
          const metadata = await sharp(fileBuffer).metadata();
          
          // Generate thumbnails
          const thumbnailBuffer = await sharp(fileBuffer)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toBuffer();

          // Generate unique filename
          const fileExtension = path.extname(file.originalFilename);
          const fileName = `${uuidv4()}${fileExtension}`;
          const thumbnailName = `thumb_${fileName}`;

          // Initialize Firebase Storage
          const storage = getStorage();
          
          // Upload original image
          const imageRef = ref(storage, `images/${userId}/${fileName}`);
          const imageSnapshot = await uploadBytes(imageRef, fileBuffer, {
            contentType: file.mimetype,
            customMetadata: {
              originalName: file.originalFilename,
            }
          });
          const imageUrl = await getDownloadURL(imageSnapshot.ref);

          // Upload thumbnail
          const thumbnailRef = ref(storage, `images/${userId}/thumbnails/${thumbnailName}`);
          const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailBuffer, {
            contentType: 'image/jpeg',
          });
          const thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);

          // Save metadata to Firestore
          const imageDoc = await addDoc(collection(db, `users/${userId}/images`), {
            filename: file.originalFilename,
            storagePath: `images/${userId}/${fileName}`,
            url: imageUrl,
            thumbnailUrl,
            size: file.size,
            mimeType: file.mimetype,
            dimensions: {
              width: metadata.width,
              height: metadata.height,
            },
            uploadedAt: serverTimestamp(),
            alt: '',
          });

          uploadedFiles.push({
            id: imageDoc.id,
            filename: file.originalFilename,
            url: imageUrl,
            thumbnailUrl,
            size: file.size,
            dimensions: {
              width: metadata.width,
              height: metadata.height,
            },
          });

          // Clean up temporary file
          fs.unlinkSync(file.filepath);

        } catch (fileError) {
          console.error('File processing error:', fileError);
          // Continue with other files
        }
      }

      res.status(200).json({ 
        success: true, 
        files: uploadedFiles,
        message: `${uploadedFiles.length} file(s) uploaded successfully`
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
}

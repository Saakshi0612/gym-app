import { FileModel } from '../models/fileModel';
import { Types } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Define the Express.Multer.File interface if it's not available
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// Create a GridFS bucket for storing files
const bucket = new GridFSBucket(mongoose.connection.db, {
  bucketName: 'files'
});

export const saveFileToMongoDB = async (
  file: MulterFile,
  userId: Types.ObjectId
): Promise<string> => {
  try {
    // Create a unique filename with the original extension
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${new ObjectId()}.${fileExtension}`;
    
    // Upload the file to GridFS
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
      contentType: file.mimetype,
      metadata: {
        userId: userId.toString(),
        originalName: file.originalname
      }
    });
    
    // Write the buffer to the upload stream
    uploadStream.end(file.buffer);
    
    // Wait for the upload to complete
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        // Create a reference in the FileModel
        const fileDoc = new FileModel({
          filename: uniqueFilename,
          contentType: file.mimetype,
          gridFSId: uploadStream.id.toString(),
          userId
        });
        
        fileDoc.save()
          .then(() => resolve(fileDoc._id.toString()))
          .catch(reject);
      });
      
      uploadStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error saving file to MongoDB:', error);
    throw new Error('Failed to save file to database');
  }
};

export const getFileFromMongoDB = async (fileId: string) => {
  try {
    // First get the file metadata from our FileModel
    const fileDoc = await FileModel.findById(fileId);
    if (!fileDoc) {
      throw new Error('File not found');
    }
    
    // Create a download stream from GridFS
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileDoc.gridFSId));
    
    // Convert stream to buffer
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
      downloadStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error retrieving file from MongoDB:', error);
    throw new Error('Failed to retrieve file from database');
  }
};

export const deleteFileFromMongoDB = async (fileId: string) => {
  try {
    // First get the file metadata
    const fileDoc = await FileModel.findById(fileId);
    if (!fileDoc) {
      throw new Error('File not found');
    }
    
    // Delete from GridFS
    await bucket.delete(new ObjectId(fileDoc.gridFSId));
    
    // Delete from FileModel
    await FileModel.findByIdAndDelete(fileId);
  } catch (error) {
    console.error('Error deleting file from MongoDB:', error);
    throw new Error('Failed to delete file from database');
  }
}; 
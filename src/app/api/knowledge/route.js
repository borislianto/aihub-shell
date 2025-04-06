import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Handle file uploads
export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const projectId = formData.get('projectId');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', projectId);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }
    
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const fileId = uuidv4();
        const fileName = `${fileId}-${file.name}`;
        const filePath = join(uploadDir, fileName);
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        await writeFile(filePath, buffer);
        
        return {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          isText: false,
          path: filePath,
          createdAt: new Date().toISOString()
        };
      })
    );
    
    // In a real implementation, save file info to database
    
    return NextResponse.json({
      success: true,
      files: savedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// Save text document
export async function PUT(request) {
  try {
    const { projectId, textTitle, textContent, itemId = null } = await request.json();
    
    if (!textTitle || !textContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new text document or update existing one
    const textDocument = {
      id: itemId || uuidv4(),
      name: textTitle,
      type: 'text/plain',
      size: Buffer.byteLength(textContent, 'utf8'),
      content: textContent,
      isText: true,
      createdAt: new Date().toISOString(),
      updatedAt: itemId ? new Date().toISOString() : null
    };
    
    // In a real implementation, save to database
    
    return NextResponse.json({
      success: true,
      document: textDocument
    });
  } catch (error) {
    console.error('Error saving text document:', error);
    return NextResponse.json(
      { error: 'Failed to save text document' },
      { status: 500 }
    );
  }
}
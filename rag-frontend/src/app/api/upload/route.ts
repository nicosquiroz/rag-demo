  // import { NextRequest, NextResponse } from 'next/server';
  // import { promises as fs } from 'fs';
  // import path from 'path';
  // import formidable from 'formidable';

  // export const config = {
  //   api: {
  //     bodyParser: false,
  //   },
  // };

  // export async function POST(req: NextRequest) {
  //   const form = formidable({ multiples: false });
  //   const tempDir = path.join(process.cwd(), 'tmp');
  //   await fs.mkdir(tempDir, { recursive: true });

  //   return new Promise((resolve, reject) => {
  //     form.parse(req, async (err, fields, files) => {
  //       if (err) {
  //         resolve(NextResponse.json({ error: 'Error parsing file' }, { status: 400 }));
  //         return;
  //       }
  //       const file = files.file as formidable.File;
  //       if (!file) {
  //         resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
  //         return;
  //       }
  //       const tempFilePath = path.join(tempDir, file.originalFilename || file.newFilename);
  //       await fs.copyFile(file.filepath, tempFilePath);
  //       resolve(NextResponse.json({ success: true, filename: file.originalFilename }));
  //     });
  //   });
  // } 
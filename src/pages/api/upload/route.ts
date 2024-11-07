import { NextResponse } from "next/server";
import fs, { createWriteStream } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/constants";

export const POST = async (req: Request) => {
  const uploadDir = path.join(process.cwd(), "app/uploads");
  // check if the dir exist if not create it
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Ensure body is not null
  const { body } = req;
  console.log("***", body);
  if (!body) {
    return NextResponse.json(
      { error: "No file data provided" },
      { status: 400 }
    );
  }

  // generate a unique id for each file upload
  const id = uuidv4();

  try {
    //Create a readable stream from the request body
    const reader = body.getReader();

    if (!reader) {
      return NextResponse.json(
        { error: "No file data provided" },
        { status: 400 }
      );
    }
    console.log("reader", reader);
    const chunks: Uint8Array[] = [];
    let contentLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      contentLength += value.length;
    }

    // Create a Blob from the chunks
    const blob = new Blob(chunks);
    const file = new File([blob], "uploadedFile", { type: blob.type });
    console.log("the file", file);
    // Check file size
    if (contentLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50 MB" },
        { status: 400 }
      );
    }
    // Check file type
    const fileType = path.extname(file.name).slice(1).toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "File type is not allowed" },
        { status: 400 }
      );
    }

    // Create a write stream to save the file
    const uploadDir = path.join(process.cwd(), "uploads");

    // Create a unique filename or handle naming as needed
    const filePath = path.join(uploadDir, `Soneras-${id}.${fileType}`);

    // Create a writable stream for the file
    const writeStream = createWriteStream(filePath);

    // Function to read from the request body and write to the file
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        //exit loop when done
        if (done) break;
        writeStream.write(value); // Write the chunk to the file
      }

      //close the writable stream
      writeStream.end();
    };

    //start the reading and writing process
    await pump();

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

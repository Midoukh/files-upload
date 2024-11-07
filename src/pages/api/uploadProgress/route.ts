import { NextResponse } from 'next/server';
import { Readable } from 'stream';

let progress = 0; // Progress tracking variable

//This function handler simulates a file upload
//it updates the progress variable as if it's processing the file
export const checkforUpldPrgress = async (req: Request) => {
  // Reset progress when a new upload starts
  progress = 0;

  const {body} = req
  if (!body) return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
  const reader = body.getReader();

  const pump = async () => {
    const totalChunks = 100; // Simulate total chunks
    let chunksProcessed = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Simulate processing
      chunksProcessed += 1;
      progress = Math.round((chunksProcessed / totalChunks) * 100);

      // Simulate a delay to mimic upload processing
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  await pump();

  return NextResponse.json({ message: 'File uploaded successfully' });
}

//This function handler send progress updates to the client
export const getUpldPrgrs = (req: Request) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  
  // Send headers for SSE
  writer.write(`data: ${JSON.stringify({ progress })}\n\n`);

  const interval = setInterval(() => {
    writer.write(`data: ${JSON.stringify({ progress })}\n\n`);
    
    // Stop sending updates when progress is complete
    if (progress >= 100) {
      clearInterval(interval);
      writer.close();
    }
  }, 1000); // Update every second

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

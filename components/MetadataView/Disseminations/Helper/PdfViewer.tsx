'use client';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PdfViewer({ url }: { url: string }) {
  const defaultLayout = defaultLayoutPlugin();
  return (
    <div className="w-full rounded-xl border bg-white overflow-hidden">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-[100vh]">
          <Viewer fileUrl={url} plugins={[defaultLayout]} theme="light" />
        </div>
      </Worker>
    </div>
  );
}

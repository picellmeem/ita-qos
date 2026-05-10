"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeCard({
  itemId,
  itemName,
  module,
}: {
  itemId: string;
  itemName: string;
  module: "pharmacy" | "maintenance";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const targetUrl = `${window.location.origin}/scan/${itemId}`;
    setUrl(targetUrl);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, targetUrl, {
        width: 200,
        margin: 1,
        color: { dark: "#1a3a6b", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
    }
  }, [itemId]);

  function download() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qr-${itemId}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  function printQr() {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const w = window.open("", "_blank", "width=420,height=600");
    if (!w) return;
    const icon = module === "pharmacy" ? "💊" : "⚙️";
    w.document.write(`
      <html><head><title>QR ${itemId}</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; text-align: center; padding: 24px; }
        .label { border: 2px dashed #1a56db; border-radius: 14px; padding: 18px; max-width: 280px; margin: 0 auto; }
        .name { font-size: 14px; font-weight: 600; color: #1a3a6b; margin-bottom: 8px; }
        .id { font-family: monospace; font-size: 11px; background: #f0f5ff; color: #1a56db; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-bottom: 12px; font-weight: 700; }
        .brand { font-size: 9px; color: #94a3b8; margin-top: 10px; letter-spacing: 1px; }
        @media print { body { padding: 0; } .label { border-style: solid; } }
      </style></head><body>
        <div class="label">
          <div class="name">${icon} ${itemName}</div>
          <div class="id">${itemId}</div>
          <img src="${dataUrl}" width="180" height="180" alt="QR" />
          <div class="brand">SCAN ME · ITA-QOS</div>
        </div>
        <script>setTimeout(() => window.print(), 200);</script>
      </body></html>
    `);
    w.document.close();
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    alert("คัดลอก URL แล้ว: " + url);
  }

  return (
    <div className="card">
      <div className="card-title">📱 QR Code · NFC Tag</div>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-lg border border-brand-100 bg-white p-3">
          <canvas ref={canvasRef} />
        </div>
        <p className="text-center text-[11px] text-slate-500">
          สแกน QR หรือ tap NFC tag → เปิดหน้านี้ทันที
        </p>
        <div className="grid w-full grid-cols-2 gap-2">
          <button onClick={download} className="btn-secondary !text-xs">⬇️ ดาวน์โหลด</button>
          <button onClick={printQr} className="btn-secondary !text-xs">🖨 พิมพ์ Label</button>
        </div>
        <button onClick={copyUrl} className="text-[11px] text-slate-500 hover:text-brand-500">
          📋 คัดลอก URL
        </button>
      </div>
    </div>
  );
}

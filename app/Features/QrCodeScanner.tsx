"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  QrCode,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { checkBooking } from "@/lib/controllers/bookingController";

/* Section: Dynamic Import */
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false },
);

/* Section: Types */
type ScanStatus = "idle" | "scanning" | "success" | "error";
type VerifyStatus = "idle" | "verifying" | "valid" | "invalid" | "server_error";

type VerifyResult = {
  status: VerifyStatus;
  message?: string;
};

/* Section: Sub-components */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function ScanStatusBadge({ status }: { status: ScanStatus }) {
  const map = {
    idle: {
      label: "Ready to scan",
      dot: "bg-foreground",
      pill: "bg-foreground/15 text-foreground border-border",
    },
    scanning: {
      label: "Scanning…",
      dot: "bg-accent-foreground animate-pulse",
      pill: "bg-accent text-accent-foreground dark:text-accent-foreground border-accent/40",
    },
    success: {
      label: "Scanned",
      dot: "bg-black",
      pill: "bg-green-500 text-black dark:text-black border-green-500/30",
    },
    error: {
      label: "Camera error",
      dot: "bg-white",
      pill: "bg-destructive text-white border-destructive/30",
    },
  };
  const { label, dot, pill } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${pill}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function VerifyCard({ verify }: { verify: VerifyResult }) {
  /* Section: Verify States Map */
  const map = {
    verifying: {
      icon: (
        <Loader2
          className="size-14 md:size-16 text-accent animate-spin"
          strokeWidth={1.5}
        />
      ),
      heading: "Verifying…",
      sub: "Checking with the server",
      cardClass: "border-accent/30 bg-accent/5",
      headingClass: "text-foreground",
    },
    valid: {
      icon: (
        <CheckCircle
          className="size-14 md:size-16 text-green-500"
          strokeWidth={1.5}
        />
      ),
      heading: "Valid Ticket",
      sub: "This booking is confirmed and active.",
      cardClass: "border-green-500/30 bg-green-500/5",
      headingClass: "text-green-700 dark:text-green-400",
    },
    invalid: {
      icon: (
        <XCircle
          className="size-14 md:size-16 text-destructive"
          strokeWidth={1.5}
        />
      ),
      heading: "Invalid Ticket",
      sub: "No matching booking found.",
      cardClass: "border-destructive/30 bg-destructive/5",
      headingClass: "text-destructive",
    },
    server_error: {
      icon: (
        <AlertTriangle
          className="size-14 md:size-16 text-destructive"
          strokeWidth={1.5}
        />
      ),
      heading: "Server Error",
      sub: verify.message ?? "Something went wrong. Try again.",
      cardClass: "border-destructive/30 bg-destructive/5",
      headingClass: "text-destructive",
    },
    idle: null,
  };

  const config = map[verify.status];
  if (!config) return null;

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 shadow-sm flex flex-col items-center text-center gap-3 ${config.cardClass}`}
    >
      {config.icon}
      <h2
        className={`text-2xl md:text-3xl font-black tracking-tight ${config.headingClass}`}
      >
        {config.heading}
      </h2>
      <p className="text-[13px] text-muted-foreground">{config.sub}</p>
    </div>
  );
}

/* Section: Main Component */
export default function QrCodeScanner() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [verify, setVerify] = useState<VerifyResult>({ status: "idle" });
  const [paused, setPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  /* Section: Scan Handler */
  async function handleScan(detectedCodes: IDetectedBarcode[]) {
    if (!detectedCodes.length || paused) return;

    const bookingId = detectedCodes[0].rawValue;
    setPaused(true);
    setIsActive(false);
    setVerify({ status: "verifying" });

    /* Section: Server Verification */
    try {
      const response = await checkBooking(bookingId);
      if (!response.success && !response.isValid) {
        setVerify({ status: "server_error", message: response.message });
        return;
      }
      setVerify({ status: response.isValid ? "valid" : "invalid" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setVerify({ status: "server_error", message });
    } finally {
      setScanStatus("success");
    }
  }

  /* Section: Camera Error Handler */
  function handleError(error: unknown) {
    console.error("QR Scanner error:", error);
    setCameraError(
      error instanceof Error ? error.message : "Camera access failed",
    );
    setScanStatus("error");
    setIsActive(false);
  }

  /* Section: Controls */
  function startScanning() {
    setScanStatus("scanning");
    setVerify({ status: "idle" });
    setCameraError(null);
    setPaused(false);
    setIsActive(true);
  }

  function resetScanner() {
    setScanStatus("idle");
    setVerify({ status: "idle" });
    setCameraError(null);
    setPaused(false);
    setIsActive(false);
  }

  const hasResult = verify.status !== "idle";
  const showScanAgain = hasResult && verify.status !== "verifying";

  return (
    <div className="min-h-screen pt-24 md:mt-15 pb-16 px-4 md:px-8 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        {/* Section: Page Header */}
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/25 dark:border-yellow-400/25 bg-amber-500/10 dark:bg-yellow-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-yellow-800 dark:text-yellow-400 uppercase tracking-[0.2em] mb-4">
            <QrCode className="size-3.5" />
            <span>Admin Tool</span>
          </div>
          <h1 className="text-[28px] md:text-5xl font-bold tracking-tighter leading-tight">
            QR Scanner
          </h1>
          <p className="mt-1.5 text-sm md:text-lg text-muted-foreground">
            Scan a customer's booking ticket to verify their session.
          </p>
        </div>

        <div className="grid gap-5">
          {/* Section: Scanner Viewport */}
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-border flex items-center justify-between gap-3">
              <div>
                <SectionLabel>Camera</SectionLabel>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Scan Ticket QR
                </h2>
              </div>
              <ScanStatusBadge status={scanStatus} />
            </div>

            {/* Section: Camera View */}
            <div className="relative bg-black aspect-4/3 md:aspect-video w-full overflow-hidden">
              {isActive ? (
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  paused={paused}
                  formats={["qr_code"]}
                  constraints={{ facingMode: "environment" }}
                  components={{ torch: true, zoom: false, finder: false }}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  }}
                />
              ) : scanStatus === "error" ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black px-6 text-center">
                  <XCircle
                    className="size-14 md:size-20 text-destructive"
                    strokeWidth={1.5}
                  />
                  <p className="text-white/70 text-sm md:text-base font-semibold">
                    {cameraError ?? "Camera access failed"}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black">
                  <div className="size-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
                    <QrCode
                      className="size-10 text-white/30"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-white/40 text-sm font-medium">
                    Camera inactive
                  </p>
                </div>
              )}
            </div>

            {/* Section: Camera Controls */}
            <div className="p-4 md:p-5 flex items-center gap-3 border-t border-border">
              {!isActive ? (
                <button
                  type="button"
                  onClick={startScanning}
                  className="flex-1 rounded-xl py-3 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-sm font-extrabold transition-all duration-150 hover:-translate-y-px hover:shadow-md cursor-pointer active:scale-98"
                >
                  {showScanAgain ? "Scan Again" : "Start Scanning"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetScanner}
                  className="flex-1 rounded-xl py-3 border border-border text-muted-foreground hover:text-foreground text-sm font-extrabold transition-all cursor-pointer hover:border-foreground/40"
                >
                  Cancel
                </button>
              )}
              {showScanAgain && !isActive && (
                <button
                  type="button"
                  onClick={resetScanner}
                  title="Reset"
                  className="rounded-xl p-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                >
                  <RefreshCw className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Section: Verification Result */}
          {hasResult && <VerifyCard verify={verify} />}
        </div>
      </div>
    </div>
  );
}

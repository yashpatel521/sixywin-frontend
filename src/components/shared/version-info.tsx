import { APP_VERSION } from "@/libs/constants";

export function VersionInfo({ className }: { className?: string }) {
  if (import.meta.env.PROD) {
    return null; // Hide in production
  }

  return (
    <div
      className={`fixed bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border backdrop-blur-sm ${className}`}
    >
      v{APP_VERSION.VERSION} ({APP_VERSION.ENVIRONMENT})
    </div>
  );
}

export function DetailedVersionInfo() {
  const versionInfo = APP_VERSION.VERSION_INFO;

  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-semibold">Version Information</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-medium">Version:</span> {versionInfo.version}
        </div>
        <div>
          <span className="font-medium">Build:</span> {versionInfo.buildDate}
        </div>
        <div>
          <span className="font-medium">Environment:</span>{" "}
          {versionInfo.environment}
        </div>
        <div>
          <span className="font-medium">Commit:</span> {versionInfo.commit}
        </div>
        <div>
          <span className="font-medium">WebSocket:</span> v
          {versionInfo.websocketVersion}
        </div>
        <div>
          <span className="font-medium">API:</span> {versionInfo.version}
        </div>
      </div>
    </div>
  );
}

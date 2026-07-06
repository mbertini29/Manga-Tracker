import { useEffect, useState } from "react";

export function Offline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [online]);

  if (online) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#d45353",
        color: "white",
        padding: "11px",
        textAlign: "center",
      }}
    >
        Sei offline. Alcune funzionalità potrebbero non essere disponibili.
    </div>
  );
}
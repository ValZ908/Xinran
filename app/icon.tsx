import { ImageResponse } from "next/og";

// Ikon tab: matahari kecil Ranran (dulu favicon bawaan Next).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "linear-gradient(180deg, #fde68a 0%, #fb923c 55%, #f43f5e 100%)",
            boxShadow: "0 0 16px 4px rgba(251,146,60,0.6)",
          }}
        />
      </div>
    ),
    size,
  );
}

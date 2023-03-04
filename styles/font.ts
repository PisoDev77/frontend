import localFont from "@next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

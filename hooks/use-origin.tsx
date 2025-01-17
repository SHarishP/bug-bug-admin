import { useEffect, useState } from "react";

// useOrigin is used to catch the App Url
export const useOrigin = () => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  //   // useEffect to handle hydration
  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  //   if (!mounted) {
  //     return "";
  //   }

  return origin;
};

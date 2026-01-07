import React, { Suspense } from "react";
import Reset from "./Reset";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Reset />
    </Suspense>
  );
}

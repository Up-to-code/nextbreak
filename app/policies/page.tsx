"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PoliciesPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-yellow-50">
      {/* Main content container */}
      <div className="w-full max-w-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] mt-12">
        {/* Header */}
        <h1 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-4">
          POLICIES
        </h1>
        
        {/* Description */}
        <p className="text-lg font-medium mb-8">
          Our policies are simple: we respect your privacy and provide transparent terms of service.
          Contact us if you have any questions.
        </p>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-black text-white font-bold border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none"
          >
            HOME
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="px-6 py-3 bg-white text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none"
          >
            CONTACT
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm font-bold">
        © {new Date().getFullYear()} COMPANY NAME
      </p>
    </div>
  );
};

export default PoliciesPage;
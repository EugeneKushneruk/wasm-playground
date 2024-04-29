"use client"

import dynamic from "next/dynamic";

const GifCreatorDynamic = dynamic(() => import('@/components/GifCreator'), { ssr: false });

export default function WasmGif() {

  return (
    <div className="flex min-h-screen items-center justify-center">
      <GifCreatorDynamic />
    </div>
  )
}

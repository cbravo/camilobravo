
"use client"

import { gsap } from "gsap";
import React from "react";
import FrameLoader from "../helpers/FrameLoader.js";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";



export default function FrameLoaderWrapper() {
  const ScrollRef = React.useRef(null);
  const LottieRef = React.useRef(null);
  const frameLoaderRef = React.useRef<null|FrameLoader>(null);
  const RenderCountRef = React.useRef(0);

  useGSAP(() => {
    gsap.registerPlugin(useGSAP);
    gsap.registerPlugin(ScrollTrigger);
    // if (RenderCountRef.current > 0) return;
    RenderCountRef.current++;
    const renderCount = RenderCountRef.current;

    console.log(`[${renderCount}] useGSAP ----------- mount`);
    const indexStart = 10;
    frameLoaderRef.current = frameLoaderRef.current || new FrameLoader({
      container: document.getElementById("myCanvas"),
      width: 1158,
      height: 770,
      assetPath: "/frameloader/sequence",
      indexStart,
      indexEnd: 174,
      id: renderCount,
    });

    const frameLoader = frameLoaderRef.current;

    const frames = { frame: indexStart };
    gsap.to(frames, {
      frame: 174,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ScrollRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: function (self) {
        console.log('gsap UPDATE!', frames.frame)
        frameLoader.goToFrame(frames.frame);
        // 
      },
    });

    return () => {
      console.log(`[${renderCount}] useGSAP ---- unmount `);
      frameLoader.cleanup();
    };
  });

  return (
    <div ref={ScrollRef} className="h-[5000px]">
      <div ref={LottieRef} className="sticky h-screen top-0">
        <canvas id="myCanvas" className="h-screen w-full" />
      </div>
    </div>
  );
}

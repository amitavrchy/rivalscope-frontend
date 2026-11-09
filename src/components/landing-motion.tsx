"use client";
import { useEffect, useState } from "react";

/** Progressive motion: prerendered content is always visible, including without JS. */
export function LandingMotion() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const root = document.querySelector(".rs-landing");
    if (!root || !("IntersectionObserver" in window)) return;
    root.setAttribute("data-motion-ready", "");
    root.toggleAttribute("data-motion-paused", paused);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    function stop() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    function start() {
      stop();
      if (preference.matches || paused) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            const index = Array.from(
              element.parentElement?.children || [],
            ).indexOf(element);
            const animation = element.animate(
              [
                { transform: "translate3d(0, 36px, 0)" },
                { transform: "translate3d(0, 0, 0)" },
              ],
              {
                duration: 1000,
                delay: Math.min(index, 4) * 90,
                easing: "cubic-bezier(.16,1,.3,1)",
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
            observer?.unobserve(element);
          });
        },
        { threshold: 0.12 },
      );
      root
        ?.querySelectorAll(
          ".rs-section-heading, .rs-feature, .rs-steps article, .rs-personas article, .rs-screen-grid figure, .rs-faq details, .rs-final > h2",
        )
        .forEach((element) => observer?.observe(element));
    }
    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, [paused]);
  return (
    <button
      type="button"
      className="rs-motion-control"
      aria-pressed={paused}
      onClick={() => setPaused((value) => !value)}
    >
      {paused ? "Resume motion" : "Pause motion"}
    </button>
  );
}

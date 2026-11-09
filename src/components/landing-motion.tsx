"use client";
import { useEffect, useRef, useState } from "react";

type ScrollItem = {
  element: HTMLElement;
  anchor: HTMLElement;
  axis: "translate" | "scaleX" | "scaleY";
  stagger: number;
  top: number;
  range: number;
};
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Scroll-scrubbed sections; the decorative radar runs independently in CSS. */
export function LandingMotion() {
  const [paused, setPaused] = useState(false);
  const scheduleRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".rs-landing");
    if (!root) return;
    root.setAttribute("data-motion-ready", "");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items: ScrollItem[] = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".rs-section-heading, .rs-feature, .rs-steps article, .rs-personas article, .rs-screen-grid figure, .rs-faq details, .rs-final > h2",
      ),
    ).map((element) => ({
      element,
      anchor: element,
      axis: "translate",
      stagger:
        Math.min(
          Array.from(element.parentElement?.children || []).indexOf(element),
          4,
        ) * 22,
      top: 0,
      range: 1,
    }));

    let frame = 0;
    let heroRange = 1;
    function clear() {
      items.forEach(({ element }) => element.style.removeProperty("transform"));
      root?.style.removeProperty("--rs-scroll-shift");
      root?.style.removeProperty("--rs-scan-shift");
    }
    function render() {
      frame = 0;
      if (
        !root ||
        preference.matches ||
        root.hasAttribute("data-motion-paused")
      )
        return;
      const scroll = window.scrollY;
      const heroProgress = clamp(scroll / heroRange);
      root.style.setProperty("--rs-scroll-shift", `${heroProgress * -32}px`);
      root.style.setProperty("--rs-scan-shift", `${heroProgress * 750}%`);
      items.forEach(({ element, axis, top, range }) => {
        const progress = clamp((scroll - top) / range);
        element.style.transform =
          axis === "translate"
            ? `translate3d(0, ${(1 - progress) * 36}px, 0)`
            : `${axis}(${0.08 + progress * 0.92})`;
      });
    }
    function schedule() {
      if (
        !frame &&
        !preference.matches &&
        !root?.hasAttribute("data-motion-paused")
      )
        frame = requestAnimationFrame(render);
    }
    function measure() {
      if (preference.matches) {
        clear();
        return;
      }
      if (root?.hasAttribute("data-motion-paused")) return;
      items.forEach(({ element }) => element.style.removeProperty("transform"));
      heroRange = Math.max(
        (root?.querySelector<HTMLElement>(".rs-hero")?.offsetHeight ||
          window.innerHeight) * 0.7,
        1,
      );
      items.forEach((item) => {
        const rect = item.anchor.getBoundingClientRect();
        item.top =
          rect.top + window.scrollY - window.innerHeight * 0.94 + item.stagger;
        item.range = Math.max(
          Math.min(window.innerHeight * 0.6, rect.height + 200),
          1,
        );
      });
      schedule();
    }
    scheduleRef.current = measure;
    measure();
    // Font loading can change section positions without a viewport resize.
    let disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    root.addEventListener("landing-layout-change", measure);
    preference.addEventListener("change", measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      root.removeEventListener("landing-layout-change", measure);
      preference.removeEventListener("change", measure);
      scheduleRef.current = null;
      clear();
    };
  }, []);
  useEffect(() => {
    document
      .querySelector(".rs-landing")
      ?.toggleAttribute("data-motion-paused", paused);
    if (!paused) scheduleRef.current?.();
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

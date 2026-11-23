"use client";

import { useEffect, useRef } from "react";
import styles from "./studio.module.css";

type Instrument = ReturnType<typeof import("@/lib/armillary").makeArmillary>;

export default function ArmillaryModel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const chapter = host?.closest("section");
    if (!host || !canvas || !chapter) return;
    const element = host;
    const surface = canvas;
    const section = chapter;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listeners = new AbortController();
    const passive = { signal: listeners.signal, passive: true };
    let instrument: Instrument | undefined;
    let visible = false, loading = false, closed = false, failed = false, manualRequested = false;
    let frame = 0, pointer: number | null = null, lastX = 0, lastY = 0;
    let yaw = 0, pitch = 0, mechanism = 0;
    let lastDraw = 0, baseline: number | undefined;
    const target = { yaw: 0, pitch: 0, mechanism: 0, scroll: 0 };
    element.tabIndex = 0;
    element.dataset.available = "true";

    function stopFrame() {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function schedule() {
      if (!frame && instrument && visible && !document.hidden) frame = requestAnimationFrame(paint);
    }
    function paint(now: number) {
      frame = 0;
      if (!instrument || !visible || document.hidden) return;
      const interval = lastDraw ? Math.min(now - lastDraw, 55) : 16;
      lastDraw = now;
      const ease = motion.matches ? 1 : 1 - Math.exp(-interval * .012);
      const view = target.yaw + (motion.matches ? 0 : target.scroll);
      yaw += (view - yaw) * ease;
      pitch += (target.pitch - pitch) * ease;
      mechanism += (target.mechanism - mechanism) * ease;
      instrument.draw(yaw, pitch, mechanism);
      element.dataset.live = "true";
      if (Math.abs(view - yaw) + Math.abs(target.pitch - pitch) + Math.abs(target.mechanism - mechanism) > .001) schedule();
    }
    async function load(manual = false) {
      if (manual) manualRequested = true;
      if (instrument || failed || closed || !visible || loading || (motion.matches && !manualRequested)) return;
      loading = true;
      try {
        if (!surface.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" })) {
          failed = true;
          element.dataset.available = "false";
          element.tabIndex = -1;
          return;
        }
        const { makeArmillary } = await import("@/lib/armillary");
        if (closed || failed) return;
        instrument = makeArmillary(surface);
        schedule();
      } catch {
        failed = true;
        element.dataset.available = "false";
        element.tabIndex = -1;
      } finally {
        loading = false;
      }
    }
    function pagePosition() {
      const rect = section.getBoundingClientRect();
      return (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    }
    function followScroll() {
      if (!visible || motion.matches) return;
      const progress = pagePosition();
      baseline ??= progress;
      target.scroll = Math.max(-.4, Math.min(.4, (progress - baseline) * .72));
      schedule();
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        followScroll();
        void load();
        schedule();
      } else {
        stopFrame();
      }
    });
    io.observe(element);
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    function readStage() {
      const checked = section.querySelector<HTMLInputElement>("input[data-armillary-step]:checked");
      target.mechanism = Number(checked?.value || 0) * 1.28;
    }
    readStage();
    section.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLInputElement) || !event.target.hasAttribute("data-armillary-step")) return;
      readStage();
      void load(true);
      schedule();
    }, passive);
    element.addEventListener("pointerdown", event => {
      if (event.button !== 0 || !event.isPrimary || failed) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      element.dataset.dragging = "true";
      element.setPointerCapture(pointer);
      void load(true);
    }, passive);
    element.addEventListener("pointermove", event => {
      if (pointer !== event.pointerId) return;
      target.yaw += (event.clientX - lastX) * .011;
      target.pitch = Math.max(-.52, Math.min(.66, target.pitch + (event.clientY - lastY) * .008));
      lastX = event.clientX;
      lastY = event.clientY;
      schedule();
    }, passive);
    function releasePointer() {
      pointer = null;
      delete element.dataset.dragging;
    }
    element.addEventListener("lostpointercapture", releasePointer, passive);
    element.addEventListener("pointercancel", releasePointer, passive);
    element.addEventListener("pointerup", releasePointer, passive);
    element.addEventListener("keydown", event => {
      switch (event.key) {
        case "ArrowLeft": target.yaw -= .23; break;
        case "ArrowRight": target.yaw += .23; break;
        case "ArrowUp": target.pitch = Math.min(.66, target.pitch + .15); break;
        case "ArrowDown": target.pitch = Math.max(-.52, target.pitch - .15); break;
        case "Home":
          target.yaw = target.pitch = target.scroll = 0;
          baseline = pagePosition();
          break;
        default: return;
      }
      event.preventDefault();
      void load(true);
      schedule();
    }, { signal: listeners.signal });
    window.addEventListener("scroll", followScroll, passive);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopFrame();
      else schedule();
    }, passive);
    motion.addEventListener("change", () => {
      baseline = undefined;
      target.scroll = 0;
      if (!motion.matches) void load();
      schedule();
    }, passive);
    surface.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      stopFrame();
      instrument?.dispose();
      instrument = undefined;
      failed = true;
      element.dataset.live = "false";
      element.dataset.available = "false";
      element.tabIndex = -1;
    }, { signal: listeners.signal });
    surface.addEventListener("webglcontextrestored", () => {
      failed = false;
      element.tabIndex = 0;
      element.dataset.available = "true";
      void load();
    }, passive);
    return () => {
      closed = true;
      listeners.abort();
      stopFrame();
      io.disconnect();
      resize.disconnect();
      instrument?.dispose();
      element.dataset.live = "false";
      element.dataset.available = "false";
      element.tabIndex = -1;
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.surface} role="group" aria-label="Rotate the brass armillary sphere"
      aria-describedby="armillary-instructions">
      <span className={styles.scale} aria-hidden="true" />
      {/* Locally captured transparent render shares the canvas's camera and aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scenes/armillary-study.webp" className={styles.poster} width="1188" height="990"
        loading="lazy" decoding="async" alt="A brass armillary sphere with engraved rings around a midnight-blue globe." draggable={false} />
      <canvas ref={canvasRef} data-armillary className={styles.canvas} aria-hidden="true" />
      <span className={styles.hint} aria-hidden="true">↔ Drag to rotate</span>
      <span id="armillary-instructions" className={styles.visuallyHidden}>
        Drag or use the arrow keys to turn the sphere. Press Home to reset the view.
      </span>
    </div>
  );
}

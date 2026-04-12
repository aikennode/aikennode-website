"use client";

import { motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CryptoIcon, type CryptoKind } from "@/components/crypto-cursor-icons";

const OFF = -9999;

const KINDS: CryptoKind[] = ["eth", "btc", "sol"];

type EmitterParticle = {
  id: string;
  cx: number;
  cy: number;
  angle: number;
  dist: number;
  kind: CryptoKind;
  spin: number;
};

function spawnBurst(cx: number, cy: number): EmitterParticle[] {
  const n = 7 + Math.floor(Math.random() * 5);
  const base = performance.now();
  return Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.9;
    return {
      id: `${base}-${i}`,
      cx,
      cy,
      angle,
      dist: 32 + Math.random() * 52,
      kind: KINDS[Math.floor(Math.random() * KINDS.length)]!,
      spin: (Math.random() - 0.5) * 240,
    };
  });
}

export function CryptoCursor() {
  const [active, setActive] = useState(false);
  const [showFollower, setShowFollower] = useState(false);
  const [particles, setParticles] = useState<EmitterParticle[]>([]);

  const mx = useMotionValue(OFF);
  const my = useMotionValue(OFF);

  const removeParticle = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const onMove = useCallback(
    (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setShowFollower(true);
    },
    [mx, my],
  );

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setActive(true);
    document.documentElement.classList.add("crypto-cursor-active");

    const onLeaveWindow = () => {
      setShowFollower(false);
      mx.set(OFF);
      my.set(OFF);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      setParticles((prev) => {
        const burst = spawnBurst(e.clientX, e.clientY);
        const merged = [...prev, ...burst];
        return merged.length > 48 ? merged.slice(-48) : merged;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("crypto-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [mx, my, onMove]);

  if (!active) return null;

  return (
    <>
      {showFollower ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[10050]"
          style={{ x: mx, y: my }}
        >
          <div className="flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-primary drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            <CryptoIcon kind="eth" className="h-full w-full" />
          </div>
        </motion.div>
      ) : null}

      {particles.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden
          className="pointer-events-none fixed z-[10051] h-3.5 w-3.5"
          style={{
            left: p.cx,
            top: p.cy,
            marginLeft: -7,
            marginTop: -7,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist + 16,
            opacity: 0,
            scale: 0.12,
            rotate: p.spin,
          }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => removeParticle(p.id)}
        >
          <CryptoIcon kind={p.kind} className="h-full w-full" />
        </motion.div>
      ))}
    </>
  );
}

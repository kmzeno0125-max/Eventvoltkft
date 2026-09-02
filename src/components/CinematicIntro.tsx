import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_DURATION = 2000;
const CURTAIN_DURATION = 0.9;

const ease = [0.76, 0, 0.24, 1] as const;

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'animate' | 'reveal' | 'done'>('animate');

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: '#141414' }}
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={
            phase === 'reveal'
              ? { clipPath: 'inset(0 0 100% 0)' }
              : { clipPath: 'inset(0 0 0 0)' }
          }
          transition={
            phase === 'reveal'
              ? { duration: CURTAIN_DURATION, ease }
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (phase === 'reveal') {
              setPhase('done');
              onComplete();
            }
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Lightning SVG */}
            <div className="relative w-24 h-28 md:w-32 md:h-36">
              <svg
                viewBox="0 0 120 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* White bolt (left) */}
                <motion.path
                  d="M50 5 L15 70 L45 70 L30 135"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                />
                {/* Orange bolt (right) */}
                <motion.path
                  d="M70 5 L105 70 L75 70 L90 135"
                  stroke="#E8930C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.15 }}
                />
                {/* Spark glow */}
                <motion.circle
                  cx="60"
                  cy="70"
                  r="18"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.8, 0.3, 0.9, 0],
                    scale: [0.8, 0.8, 1.3, 1, 1.4, 0.8],
                  }}
                  transition={{ duration: 1.8, delay: 1.0, ease: 'easeOut' }}
                  style={{
                    filter: 'blur(8px)',
                    fill: '#E8930C',
                  }}
                />
                <motion.circle
                  cx="60"
                  cy="70"
                  r="6"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 1, 0.5, 1, 0],
                  }}
                  transition={{ duration: 1.8, delay: 1.0, ease: 'easeOut' }}
                  style={{
                    filter: 'blur(3px)',
                    fill: 'white',
                  }}
                />
              </svg>
            </div>

            {/* Company name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease }}
            >
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-wide">
                EventVolt <span className="font-medium">kft</span>
              </h1>
              <p
                className="mt-1 text-xs md:text-sm tracking-[0.3em] uppercase"
                style={{ color: '#E8930C' }}
              >
                Industrial Environments
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="w-48 md:w-64 h-[2px] bg-white/10 mt-4 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#E8930C' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: INTRO_DURATION / 1000 - 0.3, ease: 'easeInOut', delay: 0.3 }}
                onAnimationComplete={() => setPhase('reveal')}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';
import { Repeat, Users, Receipt, Home, Wallet, PieChart, User } from 'lucide-react';

const bars = [10, 18, 13, 24, 16, 28];

const callouts = [
  {
    icon: Repeat,
    text: 'Loans stay tracked automatically',
    side: 'left',
    dotTop: '26%',
    dotSide: 'left',
    bubbleTop: '10%',
  },
  {
    icon: Users,
    text: 'Committees never slip your mind',
    side: 'right',
    dotTop: '54%',
    dotSide: 'right',
    bubbleTop: '42%',
  },
  {
    icon: Receipt,
    text: 'Split any bill in seconds',
    side: 'left',
    dotTop: '80%',
    dotSide: 'left',
    bubbleTop: '72%',
  },
];

const CYCLE = 2 * callouts.length;

const calloutTiming = (index) => ({
  duration: 2,
  times: [0, 0.12, 0.88, 1],
  repeat: Infinity,
  repeatDelay: CYCLE - 2,
  delay: index * 2,
  ease: 'easeInOut',
});

function TargetDot({ callout, index }) {
  return (
    <div
      className="absolute z-10"
      style={{
        top: callout.dotTop,
        [callout.dotSide]: '-3px',
      }}
    >
      <motion.span
        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.5, 0.5, 0], scale: [0.6, 1.8, 1.8, 0.6] }}
        transition={calloutTiming(index)}
      />
      <motion.span
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={calloutTiming(index)}
      />
    </div>
  );
}

function CalloutBubble({ callout, index }) {
  const Icon = callout.icon;
  const isLeft = callout.side === 'left';

  return (
    <motion.div
      className="absolute z-20 flex w-[132px] items-start gap-1.5 rounded-xl border border-white/15 bg-[#17171c] px-2.5 py-2 shadow-xl"
      style={{
        top: callout.bubbleTop,
        [isLeft ? 'right' : 'left']: 'calc(100% + 14px)',
      }}
      initial={{ opacity: 0, x: isLeft ? 6 : -6 }}
      animate={{ opacity: [0, 1, 1, 0], x: isLeft ? [6, 0, 0, 6] : [-6, 0, 0, -6] }}
      transition={calloutTiming(index)}
    >
      <span
        className={`absolute top-3.5 h-2.5 w-2.5 rotate-45 border border-white/15 bg-[#17171c] ${
          isLeft ? '-right-[5px] border-b-0 border-l-0' : '-left-[5px] border-r-0 border-t-0'
        }`}
      />
      <Icon className="mt-0.5 h-3 w-3 flex-shrink-0 text-white/70" />
      <span className="text-[10.5px] leading-tight text-white/85">{callout.text}</span>
    </motion.div>
  );
}

function PhoneScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#101015] to-[#0a0a0d] p-2.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[9px] font-medium text-white/50">9:41</span>
        <div className="flex items-center gap-0.5">
          <span className="h-1.5 w-0.5 rounded-full bg-white/40" />
          <span className="h-2 w-0.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-0.5 rounded-full bg-white/60" />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-0.5">
        <span className="text-[8px] font-semibold tracking-wide text-white/60">VAULTRIX</span>
        <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </div>

      <div className="mt-2.5 rounded-lg bg-white p-2">
        <div className="flex items-center justify-between">
          <span className="text-[7px] uppercase tracking-wide text-black/45">Total balance</span>
          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-medium text-emerald-600">
            +4.2%
          </span>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-ink">148,240.00</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-white/10 bg-white/[0.06] p-1.5">
          <Wallet className="h-2.5 w-2.5 text-white/50" />
          <p className="mt-1 text-[7px] text-white/45">Loans</p>
          <p className="text-[9px] font-medium text-white/85">12,000</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.06] p-1.5">
          <Users className="h-2.5 w-2.5 text-white/50" />
          <p className="mt-1 text-[7px] text-white/45">Committees</p>
          <p className="text-[9px] font-medium text-white/85">3 active</p>
        </div>
      </div>

      <div className="mt-2 flex h-10 flex-1 items-end gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1.5">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className="w-full rounded-sm bg-white/35"
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.08, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5">
        <Home className="h-3 w-3 text-white/80" />
        <PieChart className="h-3 w-3 text-white/35" />
        <Receipt className="h-3 w-3 text-white/35" />
        <User className="h-3 w-3 text-white/35" />
      </div>
    </div>
  );
}

function AuthVisual() {
  return (
    <div className="relative flex h-80 items-center md:h-96">
      <div className="relative ml-4 h-[272px] w-[160px] md:h-[300px] md:w-[176px]">
        <motion.div
          className="absolute inset-0 -z-10 rounded-[2.4rem] bg-white/[0.06] blur-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative h-full w-full rounded-[2rem] border border-white/15 bg-white/[0.03] p-1.5 shadow-2xl"
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <div className="absolute left-1/2 top-1.5 h-1 w-7 -translate-x-1/2 rounded-full bg-white/25" />
          <div className="h-full w-full overflow-hidden rounded-[1.4rem]">
            <PhoneScreen />
          </div>
        </motion.div>

        {callouts.map((callout, index) => (
          <TargetDot key={`${callout.text}-dot`} callout={callout} index={index} />
        ))}
        {callouts.map((callout, index) => (
          <CalloutBubble key={`${callout.text}-bubble`} callout={callout} index={index} />
        ))}
      </div>
    </div>
  );
}

export default AuthVisual;

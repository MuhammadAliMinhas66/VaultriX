import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wallet, Users, Receipt } from 'lucide-react';

const bars = [10, 18, 13, 24, 16, 28];

function OverviewCard() {
  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Home} label="Overview" />
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
            transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  );
}

function LoansCard() {
  const rows = [
    { name: 'Ahmed Raza', note: 'You lent', amount: '8,000', positive: true },
    { name: 'Sara Khan', note: 'You owe', amount: '4,200', positive: false },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Wallet} label="Loans" />
      <div className="mt-2.5 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[7px] font-medium text-white/70">
                {row.name.charAt(0)}
              </div>
              <div>
                <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
                <p className="text-[7px] text-white/40">{row.note}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-medium ${row.positive ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {row.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[7px] text-white/45">
        Repayment schedule stays up to date automatically.
      </div>
    </div>
  );
}

function CommitteesCard() {
  const rows = [
    { name: 'Family committee', progress: 60, note: '6 of 10 rounds' },
    { name: 'Office committee', progress: 30, note: '3 of 10 rounds' },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Users} label="Committees" />
      <div className="mt-2.5 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="rounded-md border border-white/10 bg-white/[0.05] p-2">
            <div className="flex items-center justify-between">
              <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
              <p className="text-[7px] text-white/40">{row.note}</p>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-white/60"
                initial={{ width: 0 }}
                animate={{ width: `${row.progress}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillsCard() {
  const rows = [
    { name: 'Electricity bill', note: 'Split 3 ways', amount: '6,000' },
    { name: 'Internet', note: 'Split 3 ways', amount: '3,000' },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Receipt} label="This month" />
      <div className="mt-2.5 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[8px] text-white/70">
        You owe <span className="font-medium text-white/90">Bilal Rs 2,400</span>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5"
          >
            <div>
              <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
              <p className="text-[7px] text-white/40">{row.note}</p>
            </div>
            <span className="text-[9px] font-medium text-white/80">{row.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 px-0.5">
      <Icon className="h-3 w-3 text-white/60" />
      <span className="text-[8px] font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
    </div>
  );
}

const screens = [
  { Component: OverviewCard },
  { Component: LoansCard },
  { Component: CommitteesCard },
  { Component: BillsCard },
];

const callouts = [
  { text: 'Real-time balance across accounts', dotTop: 30, dotLeft: 50, align: 'center' },
  { text: 'See exactly who owes who', dotTop: 30, dotLeft: 24, align: 'left' },
  { text: 'Follow every committee round', dotTop: 30, dotLeft: 50, align: 'center' },
  { text: 'Split any bill in seconds', dotTop: 28, dotLeft: 50, align: 'center' },
];

const SCREEN_DURATION = 2800;
const LINE_LEN = 24;

function PhoneScreen({ index }) {
  const ActiveCard = screens[index].Component;

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#101015] to-[#0a0a0d] p-3">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-medium text-white/50">9:41</span>
        <div className="flex items-center gap-0.5">
          <span className="h-1.5 w-0.5 rounded-full bg-white/40" />
          <span className="h-2 w-0.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-0.5 rounded-full bg-white/60" />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between px-0.5">
        <span className="text-[9px] font-semibold tracking-wide text-white/60">VAULTRIX</span>
        <div className="h-3 w-3 rounded-full bg-white/20" />
      </div>

      <div className="relative mt-3 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full text-[10px]"
          >
            <ActiveCard />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-1 pt-1.5">
        {screens.map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={`h-1 rounded-full transition-all duration-300 ${
              dotIndex === index ? 'w-4 bg-white/70' : 'w-1 bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Callout({ callout, index }) {
  const alignOffset = { left: '0%', center: '-50%', right: '-100%' }[callout.align];
  const anchorTop = `calc(${callout.dotTop}% - ${LINE_LEN}px)`;

  return (
    <motion.div
      key={index}
      className="pointer-events-none absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div
        className="absolute whitespace-nowrap rounded-lg border border-white/20 bg-[#1c1c22] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-xl"
        style={{
          top: anchorTop,
          left: `${callout.dotLeft}%`,
          transform: `translate(${alignOffset}, -100%)`,
        }}
      >
        {callout.text}
      </div>

      <div
        className="absolute w-px bg-white/35"
        style={{
          top: anchorTop,
          left: `${callout.dotLeft}%`,
          height: LINE_LEN,
          transform: 'translateX(-50%)',
        }}
      />

      <span
        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25"
        style={{ top: `${callout.dotTop}%`, left: `${callout.dotLeft}%` }}
      />
      <span
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ top: `${callout.dotTop}%`, left: `${callout.dotLeft}%` }}
      />
    </motion.div>
  );
}

function AuthVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % screens.length);
    }, SCREEN_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-[470px] items-center justify-center lg:h-[510px]">
      <div className="relative h-[380px] w-[220px] lg:h-[424px] lg:w-[248px]">
        <motion.div
          className="absolute inset-0 -z-10 rounded-[3rem] bg-white/[0.08] blur-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative h-full w-full rounded-[3rem] border-[3px] border-[#48484f] bg-gradient-to-b from-[#2c2c31] to-[#19191c] p-[3px] shadow-2xl"
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <span className="absolute -left-[3px] top-[68px] h-4 w-[3px] rounded-l-sm bg-[#5a5a62]" />
          <span className="absolute -left-[3px] top-[92px] h-9 w-[3px] rounded-l-sm bg-[#5a5a62]" />
          <span className="absolute -left-[3px] top-[132px] h-9 w-[3px] rounded-l-sm bg-[#5a5a62]" />
          <span className="absolute -right-[3px] top-[100px] h-12 w-[3px] rounded-r-sm bg-[#5a5a62]" />

          <div className="relative h-full w-full overflow-hidden rounded-[2.7rem] border border-black/60 bg-black">
            <div className="absolute left-1/2 top-2 z-30 flex h-[18px] w-[64px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
            </div>

            <div className="relative z-0 h-full w-full overflow-hidden rounded-[2.4rem]">
              <PhoneScreen index={index} />
            </div>

            <AnimatePresence mode="wait">
              <Callout key={index} callout={callouts[index]} index={index} />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthVisual;

"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import type { SiteData } from "@/lib/types";

type Screen =
  | "countdown"
  | "greeting"
  | "cake"
  | "reasons"
  | "photos"
  | "videos"
  | "letter"
  | "secret";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export default function BirthdayExperience({ data }: { data: SiteData }) {
  const { settings, reasons, photos, videos } = data;

  const isBirthdayToday = useMemo(() => {
    const now = new Date();
    return now.getMonth() === settings.birthday_month && now.getDate() === settings.birthday_day;
  }, [settings.birthday_month, settings.birthday_day]);

  const [screen, setScreen] = useState<Screen>(isBirthdayToday ? "greeting" : "countdown");
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      settings.birthday_month,
      settings.birthday_day,
      settings.birthday_hour,
      settings.birthday_minute,
      0
    );
    if (now > target) target.setFullYear(target.getFullYear() + 1);
    return { target, left: getTimeLeft(target) };
  });

  const [candlesBlown, setCandlesBlown] = useState(0);
  const [cakeCut, setCakeCut] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [countdownAudioPlayed, setCountdownAudioPlayed] = useState(false);

  // Countdown ticker
  useEffect(() => {
    if (screen !== "countdown") return;
    const id = setInterval(() => {
      const left = getTimeLeft(timeLeft.target);
      if (!left) {
        setScreen("greeting");
        clearInterval(id);
        return;
      }
      // Play the countdown-ending sound during the last 10 seconds, once.
      const msLeft = timeLeft.target.getTime() - Date.now();
      if (msLeft <= 10000 && !countdownAudioPlayed && settings.countdown_audio_url) {
        countdownAudioRef.current
          ?.play()
          .then(() => setCountdownAudioPlayed(true))
          .catch(() => {});
      }
      setTimeLeft((prev) => ({ ...prev, left }));
    }, 1000);
    return () => clearInterval(id);
  }, [screen, timeLeft.target, countdownAudioPlayed, settings.countdown_audio_url]);

  // Confetti + audio when greeting screen shows
  useEffect(() => {
    if (screen === "greeting" && !confettiFired) {
      confetti({ particleCount: 120, spread: 80 });
      setConfettiFired(true);
    }
  }, [screen, confettiFired]);

  function tryPlayAudio() {
    if (audioPlayed || !settings.birthday_audio_url) return;
    birthdayAudioRef.current
      ?.play()
      .then(() => setAudioPlayed(true))
      .catch(() => {});
  }

  const totalCandles = Math.max(1, Math.min(settings.age, 40));

  function blowCandle(i: number) {
    if (cakeCut || i < candlesBlown) return;
    setCandlesBlown(i + 1);
    confetti({ particleCount: 6, spread: 30, colors: ["#e8b84b", "#ffffff"] });
  }

  function cutCake() {
    if (cakeCut || candlesBlown !== totalCandles) return;
    setCakeCut(true);
    birthdayAudioRef.current?.pause();
    confetti({ particleCount: 150, spread: 90 });
    setTimeout(() => confetti({ particleCount: 100, spread: 60, colors: ["gold", "hotpink"] }), 200);
  }

  function nextReason() {
    if (reasonIndex < reasons.length - 1) {
      setReasonIndex((i) => i + 1);
    } else {
      setScreen("photos");
    }
  }

  return (
    <main
      onClick={tryPlayAudio}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-fuchsia-50 to-amber-50 text-stone-700"
    >
      {settings.birthday_audio_url && (
        <audio ref={birthdayAudioRef} loop src={settings.birthday_audio_url} />
      )}
      {settings.countdown_audio_url && (
        <audio ref={countdownAudioRef} src={settings.countdown_audio_url} />
      )}

      <FloatingBits />
      <ContactButton onClick={() => setContactOpen(true)} />

      <AnimatePresence mode="wait">
        {screen === "countdown" && (
          <CountdownScreen key="countdown" left={timeLeft.left} target={timeLeft.target} name={settings.recipient_name} />
        )}
        {screen === "greeting" && (
          <GreetingScreen
            key="greeting"
            name={settings.recipient_name}
            text={settings.greeting_text}
            onEnter={() => setScreen("cake")}
          />
        )}
        {screen === "cake" && (
          <CakeScreen
            key="cake"
            title={settings.cake_title}
            totalCandles={totalCandles}
            candlesBlown={candlesBlown}
            cakeCut={cakeCut}
            onBlow={blowCandle}
            onCut={cutCake}
            onNext={() => setScreen(reasons.length ? "reasons" : "photos")}
          />
        )}
        {screen === "reasons" && (
          <ReasonsScreen
            key="reasons"
            reasons={reasons}
            index={reasonIndex}
            onNext={nextReason}
          />
        )}
        {screen === "photos" && (
          <PhotosScreen
            key="photos"
            photos={photos}
            onOpen={setLightboxSrc}
            onNext={() => setScreen(videos.length ? "videos" : "letter")}
          />
        )}
        {screen === "videos" && (
          <VideosScreen key="videos" videos={videos} onNext={() => setScreen("letter")} />
        )}
        {screen === "letter" && (
          <LetterScreen
            key="letter"
            title={settings.letter_title}
            content={settings.letter_content}
            onNext={() => setScreen(settings.secret_photo_url ? "secret" : "letter")}
            showSecret={!!settings.secret_photo_url}
          />
        )}
        {screen === "secret" && settings.secret_photo_url && (
          <SecretScreen
            key="secret"
            photoUrl={settings.secret_photo_url}
            label={settings.secret_button_label}
            link={settings.secret_button_link}
            onOpen={setLightboxSrc}
          />
        )}
      </AnimatePresence>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute right-6 top-6 text-4xl text-white"
            onClick={() => setLightboxSrc(null)}
          >
            &times;
          </button>
          <Image
            src={lightboxSrc}
            alt="Memory"
            width={1000}
            height={1000}
            className="max-h-[85vh] w-auto rounded-2xl border-4 border-white object-contain"
          />
        </div>
      )}

      {contactOpen && (
        <ContactModal
          facebook={settings.facebook_url}
          instagram={settings.instagram_url}
          email={settings.contact_email}
          whatsapp={settings.whatsapp_url}
          emailjsPublicKey={settings.emailjs_public_key}
          emailjsServiceId={settings.emailjs_service_id}
          emailjsTemplateId={settings.emailjs_template_id}
          onClose={() => setContactOpen(false)}
        />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------

function FloatingBits() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 8,
        drift: Math.random() * 120 - 60,
        symbol: ["🦋", "🌸", "🌼", "🌺", "💮"][i % 5],
        size: 1.2 + Math.random() * 1.2,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className="floating-item"
          style={{
            left: `${it.left}%`,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            fontSize: `${it.size}rem`,
            // @ts-expect-error custom property
            "--drift": `${it.drift}px`,
          }}
        >
          {it.symbol}
        </span>
      ))}
    </div>
  );
}

function ContactButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-300 to-pink-200 text-lg shadow-lg transition hover:scale-110"
      aria-label="Contact"
    >
      💌
    </button>
  );
}

function ScreenShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative z-20 flex min-h-screen w-full flex-col items-center justify-center px-5 py-16 text-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

function CountdownScreen({
  left,
  target,
  name,
}: {
  left: { days: number; hours: number; mins: number; secs: number } | null;
  target: Date;
  name: string;
}) {
  const timeLabel = `${target.getDate()} ${MONTHS[target.getMonth()]}, ${String(target.getHours() % 12 || 12).padStart(2, "0")}:${String(
    target.getMinutes()
  ).padStart(2, "0")} ${target.getHours() >= 12 ? "PM" : "AM"}`;

  return (
    <ScreenShell>
      <p className="mb-3 font-display text-2xl text-fuchsia-600">for {name}</p>
      <h1 className="mb-8 text-2xl font-semibold text-stone-600 sm:text-3xl">
        Something is counting down... ⌛
      </h1>
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {[
          ["Days", left?.days ?? 0],
          ["Hours", left?.hours ?? 0],
          ["Mins", left?.mins ?? 0],
          ["Secs", left?.secs ?? 0],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="min-w-[76px] rounded-2xl border border-white/60 bg-white/40 px-4 py-3 backdrop-blur"
          >
            <span className="block text-3xl font-bold text-fuchsia-700">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-wide text-stone-500">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-lg text-stone-500">⏰ Arriving on {timeLabel}</p>
    </ScreenShell>
  );
}

function GreetingScreen({ name, text, onEnter }: { name: string; text: string; onEnter: () => void }) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [text]);

  return (
    <ScreenShell>
      <h1 className="animate-gentle-bounce mb-6 font-display text-5xl text-fuchsia-700 sm:text-6xl">
        Happy Birthday {name} 🎂💫
      </h1>
      <p className="mb-10 min-h-[2.5em] max-w-xl text-xl font-semibold text-violet-700">{typed}</p>
      <button
        onClick={onEnter}
        className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
      >
        Click to enter your world 💕
      </button>
    </ScreenShell>
  );
}

function CakeScreen({
  title,
  totalCandles,
  candlesBlown,
  cakeCut,
  onBlow,
  onCut,
  onNext,
}: {
  title: string;
  totalCandles: number;
  candlesBlown: number;
  cakeCut: boolean;
  onBlow: (i: number) => void;
  onCut: () => void;
  onNext: () => void;
}) {
  return (
    <ScreenShell>
      <h2 className="mb-6 font-display text-3xl text-fuchsia-700 sm:text-4xl">{title}</h2>
      <div className="mb-4 text-8xl">{cakeCut ? "🍰" : "🎂"}</div>
      {!cakeCut && (
        <div className="mb-4 flex max-w-md flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalCandles }).map((_, i) => (
            <button
              key={i}
              onClick={() => onBlow(i)}
              className={`candle-flame text-3xl transition ${i < candlesBlown ? "opacity-20 grayscale" : ""}`}
            >
              🕯️
            </button>
          ))}
        </div>
      )}
      <p className="mb-6 rounded-full bg-black/40 px-4 py-2 text-sm text-white">
        {cakeCut
          ? "🎉 Cake cut! Happy Birthday! 🎉"
          : candlesBlown === totalCandles
          ? "All candles blown — now cut the cake!"
          : `${totalCandles - candlesBlown} candles left — tap each one`}
      </p>
      {!cakeCut ? (
        <button
          onClick={onCut}
          disabled={candlesBlown !== totalCandles}
          className="rounded-full border-2 border-white bg-gradient-to-r from-amber-300 to-rose-400 px-8 py-3 text-lg font-bold text-stone-800 shadow-lg transition disabled:opacity-30"
        >
          🍰 Cut Cake
        </button>
      ) : (
        <button
          onClick={onNext}
          className="rounded-full bg-gradient-to-r from-violet-400 to-pink-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
        >
          Enter your storyline 💫
        </button>
      )}
    </ScreenShell>
  );
}

function ReasonsScreen({
  reasons,
  index,
  onNext,
}: {
  reasons: SiteData["reasons"];
  index: number;
  onNext: () => void;
}) {
  const reason = reasons[index];
  const isLast = index === reasons.length - 1;
  return (
    <ScreenShell>
      <h1 className="mb-8 animate-gentle-bounce font-display text-4xl text-fuchsia-600">
        Reasons You&apos;re Loved 💖
      </h1>
      <AnimatePresence mode="wait">
        <motion.div
          key={reason?.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 max-w-2xl rounded-3xl bg-white/90 p-8 shadow-xl"
        >
          <div className="mb-3 text-4xl">{reason?.emoji}</div>
          <p className="text-lg font-medium text-stone-600">{reason?.text}</p>
        </motion.div>
      </AnimatePresence>
      <p className="mb-6 text-sm font-semibold text-fuchsia-500">
        Reason {index + 1} of {reasons.length}
      </p>
      <button
        onClick={onNext}
        className={`rounded-full px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 ${
          isLast ? "animate-pulse bg-gradient-to-r from-violet-500 to-pink-500" : "bg-gradient-to-r from-pink-400 to-fuchsia-400"
        }`}
      >
        {isLast ? "You're the BESTEST! 💖" : "Click here... 💕"}
      </button>
    </ScreenShell>
  );
}

function PhotosScreen({
  photos,
  onOpen,
  onNext,
}: {
  photos: SiteData["photos"];
  onOpen: (src: string) => void;
  onNext: () => void;
}) {
  return (
    <ScreenShell className="max-w-6xl">
      <h1 className="mb-3 font-display text-4xl text-fuchsia-700">Our Beautiful Moments</h1>
      <p className="mb-10 max-w-xl text-stone-500">Every moment with you has been magical.</p>
      <div className="mb-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p.image_url)}
            className="group overflow-hidden rounded-2xl bg-white/90 p-3 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative mb-3 h-56 w-full overflow-hidden rounded-xl">
              <Image
                src={p.image_url}
                alt={p.title || "Memory"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p className="font-display text-lg text-fuchsia-700">{p.title}</p>
            <p className="text-sm text-stone-500">{p.caption}</p>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="rounded-full bg-gradient-to-r from-violet-400 to-pink-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
      >
        Continue your storyline 🎥
      </button>
    </ScreenShell>
  );
}

function VideosScreen({ videos, onNext }: { videos: SiteData["videos"]; onNext: () => void }) {
  return (
    <ScreenShell className="max-w-5xl">
      <h2 className="mb-10 font-display text-4xl text-fuchsia-700">A Special Video Message</h2>
      <div className="mb-10 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        {videos.map((v) => (
          <div key={v.id} className="rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur">
            {v.title && <h3 className="mb-3 text-lg font-semibold text-fuchsia-700">{v.title}</h3>}
            <video
              controls
              poster={v.poster_url ?? undefined}
              className="aspect-video w-full rounded-xl shadow-lg"
            >
              <source src={v.video_url} />
            </video>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
      >
        See your letter 💌
      </button>
    </ScreenShell>
  );
}

function LetterScreen({
  title,
  content,
  onNext,
  showSecret,
}: {
  title: string;
  content: string;
  onNext: () => void;
  showSecret: boolean;
}) {
  return (
    <ScreenShell>
      <div className="max-w-xl rounded-3xl bg-white/90 p-10 shadow-xl">
        <h2 className="mb-6 font-display text-3xl text-fuchsia-700">{title}</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed text-stone-600">{content}</p>
        {showSecret && (
          <button
            onClick={onNext}
            className="mt-8 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
          >
            One more thing 💝
          </button>
        )}
      </div>
    </ScreenShell>
  );
}

function SecretScreen({
  photoUrl,
  label,
  link,
  onOpen,
}: {
  photoUrl: string;
  label: string;
  link: string | null;
  onOpen: (src: string) => void;
}) {
  return (
    <ScreenShell>
      <div className="w-full max-w-md rounded-[2.5rem] bg-white/85 p-8 shadow-xl backdrop-blur">
        <button onClick={() => onOpen(photoUrl)} className="block w-full">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg">
            <Image src={photoUrl} alt="Secret memory" fill className="object-cover" />
          </div>
        </button>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
          >
            {label}
          </a>
        )}
      </div>
    </ScreenShell>
  );
}

const EMAILJS_SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";

declare global {
  interface Window {
    emailjs?: {
      init: (publicKey: string) => void;
      sendForm: (serviceId: string, templateId: string, form: HTMLFormElement) => Promise<unknown>;
    };
  }
}

function ContactModal({
  facebook,
  instagram,
  email,
  whatsapp,
  emailjsPublicKey,
  emailjsServiceId,
  emailjsTemplateId,
  onClose,
}: {
  facebook: string | null;
  instagram: string | null;
  email: string | null;
  whatsapp: string | null;
  emailjsPublicKey: string | null;
  emailjsServiceId: string | null;
  emailjsTemplateId: string | null;
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const formEnabled = !!(emailjsPublicKey && emailjsServiceId && emailjsTemplateId);

  // Load the EmailJS SDK once (same CDN script the original site used).
  useEffect(() => {
    if (!formEnabled) return;
    if (window.emailjs) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMAILJS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true));
      if (window.emailjs) setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = EMAILJS_SCRIPT_SRC;
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, [formEnabled]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formRef.current || !window.emailjs || !emailjsPublicKey || !emailjsServiceId || !emailjsTemplateId) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    window.emailjs.init(emailjsPublicKey);
    window.emailjs
      .sendForm(emailjsServiceId, emailjsTemplateId, formRef.current)
      .then(() => {
        setStatus("sent");
        formRef.current?.reset();
        setTimeout(() => setStatus("idle"), 3000);
      })
      .catch(() => setStatus("error"));
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-violet-500 to-purple-700 p-6 text-center shadow-2xl"
      >
        <h2 className="mb-5 text-xl font-bold text-amber-300">💌 Say Hi</h2>

        {formEnabled ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 text-left">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-white/90">Your Name</span>
              <input
                name="from_name"
                required
                placeholder="Enter your name"
                className="w-full rounded-full border-2 border-amber-300 bg-white/15 px-4 py-2 text-sm text-white placeholder-white/60 outline-none transition focus:bg-white/25"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-white/90">Your Email</span>
              <input
                type="email"
                name="from_email"
                required
                placeholder="Enter your email"
                className="w-full rounded-full border-2 border-amber-300 bg-white/15 px-4 py-2 text-sm text-white placeholder-white/60 outline-none transition focus:bg-white/25"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-white/90">Message</span>
              <textarea
                name="message"
                required
                rows={3}
                placeholder="Write your message..."
                className="w-full resize-none rounded-2xl border-2 border-amber-300 bg-white/15 px-4 py-2 text-sm text-white placeholder-white/60 outline-none transition focus:bg-white/25"
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending" || !scriptReady}
              className="w-full rounded-full border-2 border-white bg-amber-300 py-2.5 text-sm font-bold text-black shadow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "✉️ Send Message"}
            </button>
            {status === "sent" && (
              <p className="text-center text-sm font-semibold text-emerald-300">✅ Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-center text-sm font-semibold text-red-300">❌ Couldn&apos;t send — try again in a bit.</p>
            )}
          </form>
        ) : null}

        {(facebook || instagram || email || whatsapp) && (
          <div className="mt-6 flex flex-col gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                Facebook
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 px-4 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                Instagram
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-green-600 px-4 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                WhatsApp
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="rounded-full bg-stone-700 px-4 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                Email
              </a>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full border-2 border-amber-300 py-2 font-semibold text-amber-300 transition hover:bg-amber-300 hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}

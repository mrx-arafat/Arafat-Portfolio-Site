"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { playKeyboardSound, playClickSound } from "@/utils/sound";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [animateForm, setAnimateForm] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Add entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateForm(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      e.key.length === 1 || // Printable characters
      e.key === "Backspace" ||
      e.key === "Enter" ||
      e.key === " "
    ) {
      playKeyboardSound();
    }
  };

  const showToastNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Hide toast after 5 seconds
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    // RFC 5322 compliant email regex
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  // Handle email validation on blur (when user leaves the field)
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();

    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      showToastNotification("Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name: formData.get("name"),
        email: email,
        message: formData.get("message"),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setEmailError(null);
        showToastNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showToastNotification(
        "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 relative overflow-hidden grid-dots">
      {/* Matrix rain effect background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#2ed573] text-xs font-mono animate-matrix-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            {Math.random() > 0.5 ? '01' : '10'}
          </div>
        ))}
      </div>

      {/* Terminal-style Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 p-4 bg-[#0f0f0f] border ${
            toastType === "success"
              ? "border-[#2ed573]/60"
              : "border-red-500/60"
          } shadow-[0_0_20px_rgba(46,213,115,0.2)] z-50 transition-all duration-300 font-mono text-sm max-w-md`}
        >
          <div className="flex items-start gap-3">
            <span className={toastType === "success" ? "text-[#2ed573]" : "text-red-500"}>
              [{toastType === "success" ? "SUCCESS" : "ERROR"}]
            </span>
            <p className={toastType === "success" ? "text-[#2ed573]/80" : "text-red-400/80"}>
              {toastMessage}
            </p>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto text-[#2ed573]/60 hover:text-[#2ed573]"
            >
              [X]
            </button>
          </div>
        </div>
      )}

      {/* Back to Dashboard Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#2ed573]/70 hover:text-[#2ed573] font-mono text-sm transition-all duration-300 group"
          onClick={playClickSound}
        >
          <span className="text-[#2ed573]/50 group-hover:text-[#2ed573]/70">[</span>
          <span className="group-hover:translate-x-[-2px] transition-transform duration-300">←</span>
          <span>cd ../dashboard</span>
          <span className="text-[#2ed573]/50 group-hover:text-[#2ed573]/70">]</span>
        </Link>
      </div>

      {/* Terminal header */}
      <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)] max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-2 text-[#2ed573]/70 text-xs">arafat@K1NGB0B:~/contact</div>
        </div>
        <div className="flex items-center">
          <span className="text-[#2ed573] mr-2">$</span>
          <span className="text-[#2ed573]">contact --arafat</span>
          <span className="animate-blink ml-1">|</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg shadow-[0_0_20px_rgba(46,213,115,0.1)] relative overflow-hidden">
          {/* Terminal-style header inside form */}
          <div className="bg-[#1a1b26] border-b border-[#2ed573]/20 px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[#2ed573] text-sm font-mono">&gt;_</span>
              <span className="text-[#2ed573]/70 text-sm font-mono">Contact Form</span>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-2xl text-[#2ed573] font-mono mb-2">
                Anything on your mind?
              </h1>
              <div className="text-[#2ed573]/60 text-sm font-mono">
                Feel free to reach out - I'm always open to meaningful conversations.
              </div>
            </div>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="mb-6 font-mono">
                  <div className="text-[#2ed573] text-lg mb-2">Message Sent Successfully!</div>
                  <div className="text-[#2ed573]/60 text-sm">
                    Thank you for reaching out. I'll get back to you soon.
                  </div>
                </div>
                <div className="my-8">
                  <pre className="text-[#2ed573] text-xs font-mono">
{`    _____ _   _  ____ ____ _____ ____ ____
   / ____| | | |/ ___/ ___| ____/ ___/ ___|
  | (___ | | | | |  | |   |  _| \\___ \\___ \\
   \\___ \\| | | | |  | |   | |___ ___) |__) |
   ____) | |_| | |__| |___|_____|____/____/
  |_____/ \\___/ \\____\\____|               `}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsSuccess(false);
                  }}
                  className="bg-[#151620] border border-[#2ed573]/30 hover:border-[#2ed573]/60 hover:bg-[#2ed573]/10 text-[#2ed573] px-6 py-3 font-mono transition-all duration-300"
                >
                  <span className="mr-2">&gt;_</span>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className={`space-y-6 transition-all duration-500 ${
                  animateForm
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="space-y-1">
                  <label className="text-[#2ed573] text-sm font-mono block">
                    <span className="text-[#2ed573]/60">&gt;</span> Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    onKeyDown={handleKeyPress}
                    className="w-full px-4 py-3 bg-[#1a1b26] border border-[#2ed573]/20 text-[#2ed573] font-mono
                    focus:outline-none focus:border-[#2ed573]/60 focus:bg-[#151620]
                    transition-all duration-300 hover:border-[#2ed573]/40 placeholder-[#2ed573]/30"
                    placeholder="Ingrid Bergman"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#2ed573] text-sm font-mono block">
                    <span className="text-[#2ed573]/60">&gt;</span> Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onKeyDown={handleKeyPress}
                    onBlur={handleEmailBlur}
                    className={`w-full px-4 py-3 bg-[#1a1b26] border ${
                      emailError ? "border-red-500" : "border-[#2ed573]/20"
                    } text-[#2ed573] font-mono
                    focus:outline-none ${
                      emailError ? "focus:border-red-500" : "focus:border-[#2ed573]/60"
                    } focus:bg-[#151620]
                    transition-all duration-300 hover:border-[#2ed573]/40 placeholder-[#2ed573]/30`}
                    placeholder="ingrid@example.com"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1 font-mono">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[#2ed573] text-sm font-mono block">
                    <span className="text-[#2ed573]/60">&gt;</span> Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    onKeyDown={handleKeyPress}
                    className="w-full px-4 py-3 bg-[#1a1b26] border border-[#2ed573]/20 text-[#2ed573] font-mono
                    focus:outline-none focus:border-[#2ed573]/60 focus:bg-[#151620]
                    transition-all duration-300 hover:border-[#2ed573]/40 resize-none placeholder-[#2ed573]/30"
                    placeholder="Hello Arafat, I wanna reach out to you for..."
                  ></textarea>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#151620] border border-[#2ed573]/30 text-[#2ed573] font-mono
                    transition-all duration-300 hover:border-[#2ed573]/60 hover:bg-[#2ed573]/10
                    disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg">&gt;_</span>
                      <span className="uppercase tracking-wider">
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </span>
                      {isSubmitting && (
                        <div className="flex gap-1">
                          <span className="animate-pulse">.</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-[#2ed573]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

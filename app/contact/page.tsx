"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { playKeyboardSound, playClickSound } from "@/utils/sound";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [animateForm, setAnimateForm] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
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
    <main className="min-h-screen bg-[#1a1b26] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#2ed573]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#2ed573]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-40 h-40 bg-[#2ed573]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 transition-all duration-300 backdrop-blur-md ${
            toastType === "success"
              ? "bg-[#2ed573]/80 text-[#0f0f0f]"
              : "bg-red-500/80 text-white"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="font-medium">{toastMessage}</p>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <Link
        href="/dashboard"
        className="inline-flex items-center text-[#2ed573] hover:text-[#1f9b53] mb-8 relative z-10 transition-transform hover:-translate-x-1"
        onClick={playClickSound}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-xl mx-auto">
        <div className="bg-[#1e272e]/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-[#2ed573]/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ed573]/10 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2ed573]/10 rounded-full -ml-12 -mb-12 z-0"></div>
          <div className="absolute top-0 left-0 w-2 h-16 bg-[#2ed573] rounded-b-full"></div>
          <div className="absolute top-0 left-0 w-16 h-2 bg-[#2ed573] rounded-r-full"></div>
          <div className="absolute bottom-0 right-0 w-2 h-16 bg-[#2ed573] rounded-t-full"></div>
          <div className="absolute bottom-0 right-0 w-16 h-2 bg-[#2ed573] rounded-l-full"></div>

          <div className="relative z-10">
            <h1 className="text-4xl text-[#2ed573] font-bold mb-3 tracking-tight">
              Let's Connect
            </h1>
            <p className="text-[#2ed573]/80 mb-8 text-lg">
              Feel free to reach out - I'm always open to meaningful
              conversations.
            </p>

            {isSuccess ? (
              <div className="text-center py-8 px-4">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#2ed573]/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-[#2ed573]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2ed573] mb-3">
                  Message Sent!
                </h2>
                <p className="text-[#2ed573]/80 mb-8">
                  Thanks for reaching out! I'll get back to you as soon as
                  possible.
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsSuccess(false);
                  }}
                  className="px-8 py-3 bg-[#2ed573] text-[#0f0f0f] font-medium rounded-full
                transition-all duration-300 hover:bg-[#1f9b53] hover:shadow-lg transform hover:scale-105"
                >
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
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-[#2ed573]/50 group-focus-within:text-[#2ed573] transition-colors duration-300">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    onKeyDown={handleKeyPress}
                    className="peer w-full pl-10 pr-5 py-4 rounded-lg bg-[#0f0f0f]/70 border border-[#2ed573]/20 text-white
                  focus:outline-none focus:ring-2 focus:ring-[#2ed573] focus:border-transparent
                  transition-all duration-300 hover:border-[#2ed573]/50 placeholder-transparent"
                    placeholder="Your name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-10 -top-2.5 px-1 text-sm font-medium text-[#2ed573] bg-[#1e272e]
                  transition-all duration-300 transform
                  peer-placeholder-shown:text-[#2ed573]/50 peer-placeholder-shown:top-4 peer-placeholder-shown:left-10
                  peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[#2ed573] peer-focus:text-sm peer-focus:bg-[#1e272e]"
                  >
                    Name
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-4 text-[#2ed573]/50 group-focus-within:text-[#2ed573] transition-colors duration-300">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onKeyDown={handleKeyPress}
                    className="peer w-full pl-10 pr-5 py-4 rounded-lg bg-[#0f0f0f]/70 border border-[#2ed573]/20 text-white
                  focus:outline-none focus:ring-2 focus:ring-[#2ed573] focus:border-transparent
                  transition-all duration-300 hover:border-[#2ed573]/50 placeholder-transparent"
                    placeholder="your.email@example.com"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-10 -top-2.5 px-1 text-sm font-medium text-[#2ed573] bg-[#1e272e]
                  transition-all duration-300 transform
                  peer-placeholder-shown:text-[#2ed573]/50 peer-placeholder-shown:top-4 peer-placeholder-shown:left-10
                  peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[#2ed573] peer-focus:text-sm peer-focus:bg-[#1e272e]"
                  >
                    Email
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-4 text-[#2ed573]/50 group-focus-within:text-[#2ed573] transition-colors duration-300">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    onKeyDown={handleKeyPress}
                    className="peer w-full pl-10 pr-5 py-4 rounded-lg bg-[#0f0f0f]/70 border border-[#2ed573]/20 text-white
                  focus:outline-none focus:ring-2 focus:ring-[#2ed573] focus:border-transparent
                  transition-all duration-300 hover:border-[#2ed573]/50 placeholder-transparent resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-10 -top-2.5 px-1 text-sm font-medium text-[#2ed573] bg-[#1e272e]
                  transition-all duration-300 transform
                  peer-placeholder-shown:text-[#2ed573]/50 peer-placeholder-shown:top-4 peer-placeholder-shown:left-10
                  peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[#2ed573] peer-focus:text-sm peer-focus:bg-[#1e272e]"
                  >
                    Message
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#2ed573] text-[#0f0f0f] font-bold rounded-full
                  transition-all duration-300 hover:bg-[#1f9b53] hover:shadow-lg transform hover:scale-[1.02]
                  focus:ring-2 focus:ring-[#2ed573] focus:ring-offset-2 focus:ring-offset-[#0f0f0f]
                  disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </span>
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 2L11 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 2L15 22L11 13L2 9L22 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
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

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

export default function Contact() {
  const [state, handleSubmit] = useForm("mldjzrkd");

  return (
    <main className="min-h-screen bg-[#1a1b26] text-white p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-[#3b5bdb] hover:text-[#4c6ef5] mb-12"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Get in Touch</h1>

        {state.succeeded ? (
          <div className="bg-[#2a2c3b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Message Sent!</h2>
            <p className="text-white/80 mb-6">
              Thank you for reaching out. I'll get back to you soon.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#2ed573] to-[#2ed573]/80 text-[#0f0f0f] font-medium rounded-md transform transition-transform hover:scale-105 hover:shadow-2xl hover:translate-y-1 hover:translate-x-1 shadow-lg"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#2ed573] mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 rounded-md bg-[#1e272e] border border-[#2ed573]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2ed573]"
              />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2ed573] mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded-md bg-[#1e272e] border border-[#2ed573]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2ed573]"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#2ed573] mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full px-4 py-2 rounded-md bg-[#1e272e] border border-[#2ed573]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2ed573]"
              ></textarea>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>
            <button
              type="submit"
              disabled={state.submitting}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#2ed573] to-[#2ed573]/80 text-[#0f0f0f] font-medium rounded-md transform transition-transform hover:scale-105 hover:shadow-2xl hover:translate-y-1 hover:translate-x-1 shadow-lg"
            >
              {state.submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

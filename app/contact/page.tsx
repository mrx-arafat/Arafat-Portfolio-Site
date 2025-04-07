"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-[#1a1b26] text-white p-8">
      <Link href="/dashboard" className="inline-flex items-center text-[#3b5bdb] hover:text-[#4c6ef5] mb-12">
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Get in Touch</h1>

        {isSubmitted ? (
          <div className="bg-[#2a2c3b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Message Sent!</h2>
            <p className="text-white/80 mb-6">Thank you for reaching out. I'll get back to you soon.</p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="bg-[#3b5bdb] text-white hover:bg-[#4c6ef5] border-none"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-[#2a2c3b] border-[#3b5bdb] focus:border-[#4c6ef5] text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-[#2a2c3b] border-[#3b5bdb] focus:border-[#4c6ef5] text-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="bg-[#2a2c3b] border-[#3b5bdb] focus:border-[#4c6ef5] text-white"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3b5bdb] text-white hover:bg-[#4c6ef5]">
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">◌</span> Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  Send Message <Send size={16} className="ml-2" />
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}


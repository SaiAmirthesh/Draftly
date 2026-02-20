import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Sparkles } from 'lucide-react'
import { geminiService } from '../services/geminiService'
import { draftService } from '../services/draftService'

const EMAIL_TYPES = [
  'Business Email', 'Cold Email', 'Cover Letter',
  'Follow-up', 'Thank You', 'Announcement'
]

const TONES = ['Casual', 'Professional', 'Formal', 'Friendly', 'Persuasive']

export const EmailForm = () => {
  const [loading, setLoading] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [formData, setFormData] = useState({
    email_type: 'Business Email',
    tone: 'Professional',
    recipient: '',
    prompt: '',
    your_name: '',
    your_role: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.prompt) {
      alert('Please enter what you want to say!')
      return
    }

    setLoading(true)
    try {
      const prompt = `
        Write a ${formData.email_type} with a ${formData.tone} tone.
        Recipient: ${formData.recipient}
        Context: ${formData.prompt}
        Sender Name: ${formData.your_name}
        Sender Role: ${formData.your_role}
      `;

      const result = await geminiService.generateEmail(prompt);
      const emailContent = `Subject: ${result.subject}\n\n${result.content}`;
      setGeneratedEmail(emailContent);

      // Save to Supabase
      await draftService.saveDraft({
        recipient_email: formData.recipient,
        subject: result.subject,
        content: result.content,
        metadata: {
          tone: formData.tone,
          type: formData.email_type
        }
      });
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate email. Please check your API key and try again.');
    } finally {
      setLoading(false)
    }
  }

  const handleImprove = async () => {
    if (!generatedEmail) return

    setLoading(true)
    try {
      const prompt = `
        The following is an email draft. Please improve it while keeping the tone ${formData.tone}.
        Current Draft:
        ${generatedEmail}
      `;

      const result = await geminiService.generateEmail(prompt);
      const emailContent = `Subject: ${result.subject}\n\n${result.content}`;
      setGeneratedEmail(emailContent);

      // Save improved version to history as well
      await draftService.saveDraft({
        recipient_email: formData.recipient,
        subject: result.subject,
        content: result.content,
        metadata: {
          tone: formData.tone,
          type: formData.email_type,
          is_improvement: true
        }
      });
    } catch (error) {
      console.error('Improvement error:', error);
      alert('Failed to improve email.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-0 md:p-6 bg-transparent">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/40">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Email Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Email Type</label>
                <select
                  value={formData.email_type}
                  onChange={(e) => setFormData({ ...formData, email_type: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                >
                  {EMAIL_TYPES.map(type => (
                    <option key={type} className="bg-card cursor-pointer">{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                >
                  {TONES.map(tone => (
                    <option key={tone} className="bg-card cursor-pointer">{tone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Recipient Info</label>
              <input
                type="text"
                placeholder="e.g. Hiring Manager at TechCo"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Your Message Requirements</label>
              <textarea
                placeholder="What points should the AI cover?"
                rows="6"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Sender Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.your_name}
                  onChange={(e) => setFormData({ ...formData, your_name: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Sender Role</label>
                <input
                  type="text"
                  placeholder="Your Role (optional)"
                  value={formData.your_role}
                  onChange={(e) => setFormData({ ...formData, your_role: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Drafting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Draft
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Column */}
        <div className="flex flex-col h-full mt-4 lg:mt-0">
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">AI Output</h2>
            </div>
            {generatedEmail && (
              <div className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase tracking-widest">
                Generated
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[400px] flex flex-col pt-4">
            {generatedEmail ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col h-full bg-secondary/20 rounded-2xl border border-border/50 p-4"
              >
                <textarea
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  className="w-full flex-1 bg-transparent border-none focus:ring-0 p-2 font-mono text-sm leading-relaxed resize-none scrollbar-hide"
                  placeholder="Your generated email will appear here..."
                />

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/40">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedEmail);
                      alert('Copied to clipboard!');
                    }}
                    className="flex-1 min-w-[120px] bg-secondary text-foreground py-3 rounded-xl font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border"
                  >
                    <Send className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleImprove}
                    disabled={loading}
                    className="flex-1 min-w-[120px] bg-primary/10 text-primary py-3 rounded-xl font-bold hover:bg-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-primary/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Refine
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/40 rounded-3xl bg-secondary/5 group transition-colors hover:bg-secondary/10">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-6 text-muted-foreground group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-muted-foreground font-medium max-w-xs">
                  Your professionally crafted email will appear here once you hit "Generate Draft"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
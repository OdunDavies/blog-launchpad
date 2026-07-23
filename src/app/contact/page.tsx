'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell, Mail, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const successRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent && successRef.current) successRef.current.focus()
  }, [sent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !message) return
    setSending(true)
    try {
      const { error } = await (supabase as any).from('contact_messages').insert({
        name: name || null,
        email,
        message,
      })
      if (error) throw error
      setSent(true)
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send. Please email us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground"><Dumbbell className="w-4 h-4 inline mr-1" />MuscleAtlas</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Contact</span>
      </nav>

      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-8">Have a question, suggestion, or bug report? We&apos;d love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            {sent ? (
              <div className="text-center py-8">
                <Mail className="w-10 h-10 mx-auto text-primary mb-3" />
                <h3 ref={successRef} tabIndex={-1} className="font-semibold mb-2">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSent(false); setName(''); setEmail(''); setMessage('') }}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name (optional)</Label>
                  <Input id="contact-name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea id="contact-message" rows={5} placeholder="How can we help?" required value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">support@muscleatlas.site</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">We typically respond within 24-48 hours during business days.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

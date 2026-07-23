'use client'

import Link from 'next/link'
import { Dumbbell, Target, Users, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const values = [
  { icon: Dumbbell, title: 'Free for Everyone', desc: 'Fitness should be accessible. No paywalls, no subscriptions — just effective tools.' },
  { icon: Target, title: 'AI-Powered', desc: 'Smart workout generation tailored to your goals, experience, and available equipment.' },
  { icon: Users, title: 'Community Driven', desc: 'Built with feedback from real athletes, coaches, and fitness enthusiasts.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data belongs to you. Local-first sync with full export and delete capabilities.' },
]

export default function About() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground"><Dumbbell className="w-4 h-4 inline mr-1" />MuscleAtlas</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">About</span>
      </nav>

      <h1 className="text-3xl font-bold mb-4">About MuscleAtlas</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        MuscleAtlas is a free exercise library and AI-powered workout generator designed to help you build muscle, 
        track progress, and achieve your fitness goals — without paying a dime.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {values.map((v, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><v.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-3">The Story</h2>
      <p className="text-muted-foreground mb-4">
        Born from the frustration of fragmented fitness apps — overpriced subscriptions, limited exercise libraries, 
        and generic workout plans — MuscleAtlas was created to give everyone access to professional-grade fitness tools.
      </p>
      <p className="text-muted-foreground mb-4">
        With 100+ exercises, AI-generated workout plans, comprehensive tracking, and beautiful analytics, 
        MuscleAtlas puts everything you need in one place. No ads, no upsells, no data mining.
      </p>

      <h2 className="text-xl font-bold mb-3 mt-8">Built by Bar Idowu Odunayo</h2>
      <p className="text-muted-foreground">
        MuscleAtlas is developed and maintained by Bar Idowu Odunayo, a software engineer and fitness enthusiast 
        who believes the best fitness app is the one that gets out of your way and lets you train.
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/app"><Button size="sm">Try the App</Button></Link>
        <Link href="/blog"><Button variant="outline" size="sm">Read Our Blog</Button></Link>
      </div>
    </div>
  )
}

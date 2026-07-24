'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import type { Gender, ActivityLevel, WorkoutGoal } from '@/types/profile'
import { ACTIVITY_LEVEL_LABELS, WORKOUT_GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Ruler, Target, Flame, Brain, Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react'

type View = 'auth' | 'onboarding' | 'profile'
type ONBOARDING_STEP = 1 | 2 | 3 | 4
type AuthMode = 'signin' | 'signup'
type BMILevel = 'Underweight' | 'Normal' | 'Overweight' | 'Obese'

const ONBOARDING_STEPS: { step: ONBOARDING_STEP; label: string }[] = [
  { step: 1, label: 'Identity' },
  { step: 2, label: 'Metrics' },
  { step: 3, label: 'Activity' },
  { step: 4, label: 'Goals' },
]

function getBMILevel(bmi: number): BMILevel {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export default function AccountPage() {
  const { user, loading: authLoading, showOnboarding, setShowOnboarding, signIn, signUp, signOut, resetPassword } = useAuth()
  const { profile, updateProfile, bmr, tdee } = useProfile()

  const view: View = !user ? 'auth' : (showOnboarding || !profile.onboardingComplete) ? 'onboarding' : 'profile'

  // Auth state
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [showAuthPw, setShowAuthPw] = useState(false)
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  // Onboarding state
  const [onbStep, setOnbStep] = useState<ONBOARDING_STEP>(1)
  const [onbName, setOnbName] = useState(profile.name || '')
  const [onbGender, setOnbGender] = useState(profile.gender || '')
  const [onbAge, setOnbAge] = useState(profile.age?.toString() || '')
  const [onbWeight, setOnbWeight] = useState(profile.weight?.toString() || '')
  const [onbHeight, setOnbHeight] = useState(profile.height?.toString() || '')
  const [onbActivity, setOnbActivity] = useState(profile.activityLevel || '')
  const [onbDays, setOnbDays] = useState((profile.trainingDays || 3).toString())
  const [onbGoal, setOnbGoal] = useState(profile.fitnessGoal || '')
  const [onbExp, setOnbExp] = useState(profile.experience || '')

  // Profile state
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [confirmSignOut, setConfirmSignOut] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  // ── Auth View ──
  if (view === 'auth') {
    const validateAuth = (): string | null => {
      if (!authEmail.trim()) return 'Enter your email'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return 'That email doesn\'t look right'
      if (authMode === 'signup' && authPassword.length < 8) return 'Use at least 8 characters'
      return null
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setAuthError('')
      const err = validateAuth()
      if (err) { setAuthError(err); return }
      setAuthSubmitting(true)
      if (authMode === 'signup') {
        const { error } = await signUp(authEmail, authPassword)
        if (error) {
          setAuthError(error.message?.includes('already') ? 'An account already exists for this email — sign in instead' : error.message)
          setAuthSubmitting(false)
          return
        }
      } else {
        const { error } = await signIn(authEmail, authPassword)
        if (error) {
          setAuthError('Email or password didn\'t match')
          setAuthSubmitting(false)
          return
        }
      }
    }

    const handleReset = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!authEmail.trim()) { setAuthError('Enter your email'); return }
      setAuthSubmitting(true)
      const { error } = await resetPassword(authEmail)
      setAuthSubmitting(false)
      if (error) { setAuthError(error.message); return }
      setResetSent(true)
    }

    if (showReset) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
              {resetSent ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold">Check your email</h2>
                    <p className="text-sm text-muted-foreground">
                      We've sent reset instructions to <strong>{authEmail}</strong>
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => { setShowReset(false); setResetSent(false) }}>
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="text-center space-y-1 mb-4">
                    <h2 className="text-lg font-bold">Reset Password</h2>
                    <p className="text-sm text-muted-foreground">Enter your email and we'll send you instructions.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" autoComplete="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <Button className="w-full" disabled={authSubmitting}>
                    {authSubmitting ? 'Sending...' : 'Send Instructions'}
                  </Button>
                  <button type="button" onClick={() => { setShowReset(false); setAuthError('') }} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
                    Back to Sign In
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <Dumbbell className="w-8 h-8 mx-auto" />
            </Link>
            <CardTitle className="text-2xl">MuscleAtlas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-medium">
              <button type="button" className={authMode === 'signin' ? 'bg-background rounded-md py-2 shadow-sm' : 'py-2 text-muted-foreground'} onClick={() => { setAuthMode('signin'); setAuthError('') }}>Sign In</button>
              <button type="button" className={authMode === 'signup' ? 'bg-background rounded-md py-2 shadow-sm' : 'py-2 text-muted-foreground'} onClick={() => { setAuthMode('signup'); setAuthError('') }}>Sign Up</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" aria-describedby={authError ? 'auth-error' : undefined} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showAuthPw ? 'text' : 'password'} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder={authMode === 'signup' ? 'At least 8 characters' : 'Your password'} className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1" onClick={() => setShowAuthPw(v => !v)} tabIndex={-1}>
                    {showAuthPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              {authError && <p id="auth-error" className="text-sm text-destructive" aria-live="polite">{authError}</p>}
              <Button type="submit" className="w-full" disabled={authSubmitting}>
                {authSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{authMode === 'signup' ? 'Creating account…' : 'Signing in…'}</> : 'Continue'}
              </Button>
            </form>

            {authMode === 'signin' && (
              <button type="button" onClick={() => { setShowReset(true); setAuthError('') }} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
                Forgot password?
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Onboarding View ──
  if (view === 'onboarding') {
    const handleSkip = () => {
      updateProfile({ onboardingComplete: true })
      setShowOnboarding(false)
    }

    const handleFinish = () => {
      updateProfile({ name: onbName || undefined, gender: onbGender as Gender || undefined, age: onbAge ? parseInt(onbAge) : undefined, weight: onbWeight ? parseFloat(onbWeight) : undefined, height: onbHeight ? parseFloat(onbHeight) : undefined, activityLevel: onbActivity as ActivityLevel || undefined, trainingDays: parseInt(onbDays), fitnessGoal: onbGoal as WorkoutGoal || undefined, experience: onbExp as typeof profile.experience || undefined, onboardingComplete: true })
      setShowOnboarding(false)
    }

    const canAdvance = (): boolean => {
      if (onbStep === 1) return !!onbName.trim() && !!onbGender
      if (onbStep === 2) return !!onbAge && !!onbWeight && !!onbHeight
      if (onbStep === 3) return !!onbActivity
      if (onbStep === 4) return !!onbGoal && !!onbExp
      return false
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {/* Progress */}
            <div className="flex items-center gap-1 mb-6">
              {ONBOARDING_STEPS.map(s => {
                const done = s.step < onbStep
                const current = s.step === onbStep
                const rest = s.step > onbStep
                return (
                  <div key={s.step} className="flex items-center gap-1 flex-1">
                    <div className={`h-2 flex-1 rounded-full transition-colors ${done ? 'bg-red-600' : current ? 'bg-red-600' : 'bg-muted'}`} />
                    {s.step < 4 && <div className={`h-2 flex-1 rounded-full transition-colors ${rest ? 'bg-muted' : done ? 'bg-red-600' : current ? 'bg-muted/50' : 'bg-muted'}`} />}
                  </div>
                )
              })}
            </div>
            <p className="text-sm font-medium mb-6">Set {onbStep} of 4</p>

            {onbStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={onbName} onChange={e => setOnbName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={onbGender} onValueChange={setOnbGender}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {onbStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={onbAge} onChange={e => setOnbAge(e.target.value)} placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label>Weight ({profile.weightUnit || 'kg'})</Label>
                  <Input type="number" value={onbWeight} onChange={e => setOnbWeight(e.target.value)} placeholder="70" />
                </div>
                <div className="space-y-2">
                  <Label>Height ({profile.heightUnit || 'cm'})</Label>
                  <Input type="number" value={onbHeight} onChange={e => setOnbHeight(e.target.value)} placeholder="175" />
                </div>
              </div>
            )}

            {onbStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select value={onbActivity} onValueChange={setOnbActivity}>
                    <SelectTrigger><SelectValue placeholder="Select activity level" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACTIVITY_LEVEL_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Training Days / Week</Label>
                  <Select value={onbDays} onValueChange={setOnbDays}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map(d => (
                        <SelectItem key={d} value={d.toString()}>{d} day{d > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {onbStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Workout Goal</Label>
                  <Select value={onbGoal} onValueChange={setOnbGoal}>
                    <SelectTrigger><SelectValue placeholder="Select your goal" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(WORKOUT_GOAL_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Select value={onbExp} onValueChange={setOnbExp}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
              <div className="flex gap-2">
                {onbStep > 1 && <Button variant="outline" onClick={() => setOnbStep(prev => Math.max(1, prev - 1) as ONBOARDING_STEP)}>Back</Button>}
                {onbStep < 4 ? (
                  <Button disabled={!canAdvance()} onClick={() => setOnbStep(prev => Math.min(4, prev + 1) as ONBOARDING_STEP)}>Next</Button>
                ) : (
                  <Button disabled={!canAdvance()} onClick={handleFinish}>Finish</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Profile View ──
  const bmi = profile.weight && profile.height
    ? (profile.weight / ((profile.height / 100) ** 2))
    : null

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-muted-foreground hover:text-foreground p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">{user ? user.email : 'Local profile'}</p>
          </div>
        </div>
      </header>

      {/* Identity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> Identity</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditingSection(editingSection === 'identity' ? null : 'identity')}>
            {editingSection === 'identity' ? 'Done' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          {editingSection === 'identity' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={profile.name || ''} onChange={e => updateProfile({ name: e.target.value || undefined })} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={profile.age?.toString() || ''} onChange={e => updateProfile({ age: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="25" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={profile.gender || ''} onValueChange={v => updateProfile({ gender: v as Gender || undefined })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Select value={profile.experience || ''} onValueChange={v => updateProfile({ experience: v as typeof profile.experience })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground">Name</span><p>{profile.name || 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Age</span><p>{profile.age || 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Gender</span><p>{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Experience</span><p>{profile.experience ? EXPERIENCE_LABELS[profile.experience] : 'Not set'}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Body Metrics */}
      <Card id="body-stats">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Ruler className="w-4 h-4" /> Body Metrics</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditingSection(editingSection === 'body' ? null : 'body')}>
            {editingSection === 'body' ? 'Done' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {bmi !== null && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">BMI</p>
                <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">{bmi.toFixed(1)}</p>
                <p className="text-xs mt-1 font-medium">{getBMILevel(bmi)}</p>
              </div>
              {bmr && (
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">BMR</p>
                  <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">{bmr.toLocaleString()}</p>
                  <p className="text-xs mt-1 text-muted-foreground">kcal/day</p>
                </div>
              )}
              {tdee && (
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">TDEE</p>
                  <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">{tdee.toLocaleString()}</p>
                  <p className="text-xs mt-1 text-muted-foreground">kcal/day</p>
                </div>
              )}
            </div>
          )}
          {editingSection === 'body' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Weight ({profile.weightUnit || 'kg'})</Label>
                <Input type="number" value={profile.weight?.toString() || ''} onChange={e => updateProfile({ weight: e.target.value ? parseFloat(e.target.value) : undefined })} placeholder="70" />
              </div>
              <div className="space-y-2">
                <Label>Height ({profile.heightUnit || 'cm'})</Label>
                <Input type="number" value={profile.height?.toString() || ''} onChange={e => updateProfile({ height: e.target.value ? parseFloat(e.target.value) : undefined })} placeholder="175" />
              </div>
              <div className="space-y-2">
                <Label>Weight Unit</Label>
                <Select value={profile.weightUnit || 'kg'} onValueChange={v => updateProfile({ weightUnit: v as 'kg' | 'lbs' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Height Unit</Label>
                <Select value={profile.heightUnit || 'cm'} onValueChange={v => updateProfile({ heightUnit: v as 'cm' | 'ft' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : bmi === null ? (
            <p className="text-sm text-muted-foreground">
              <button onClick={() => setEditingSection('body')} className="text-primary hover:underline">Add your height and weight</button> to see your BMI, BMR, and TDEE.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground">Weight</span><p>{profile.weight ? `${profile.weight} ${profile.weightUnit || 'kg'}` : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Height</span><p>{profile.height ? `${profile.height} ${profile.heightUnit || 'cm'}` : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Activity Level</span><p>{profile.activityLevel ? ACTIVITY_LEVEL_LABELS[profile.activityLevel] : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Training Days</span><p>{profile.trainingDays || 'Not set'}/week</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Target className="w-4 h-4" /> Goals</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditingSection(editingSection === 'goals' ? null : 'goals')}>
            {editingSection === 'goals' ? 'Done' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          {editingSection === 'goals' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workout Goal</Label>
                <Select value={profile.fitnessGoal || ''} onValueChange={v => updateProfile({ fitnessGoal: v as WorkoutGoal || undefined })}>
                  <SelectTrigger><SelectValue placeholder="Select your goal" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(WORKOUT_GOAL_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Training Days / Week</Label>
                <Select value={(profile.trainingDays || 3).toString()} onValueChange={v => updateProfile({ trainingDays: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <SelectItem key={d} value={d.toString()}>{d} day{d > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={profile.activityLevel || ''} onValueChange={v => updateProfile({ activityLevel: v as ActivityLevel || undefined })}>
                  <SelectTrigger><SelectValue placeholder="Select activity level" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTIVITY_LEVEL_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground">Workout Goal</span><p>{profile.fitnessGoal ? WORKOUT_GOAL_LABELS[profile.fitnessGoal] : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Training Days</span><p>{profile.trainingDays || 'Not set'}/week</p></div>
              <div><span className="text-muted-foreground">Activity Level</span><p>{profile.activityLevel ? ACTIVITY_LEVEL_LABELS[profile.activityLevel] : 'Not set'}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-center pb-8">
        {user ? (
          confirmSignOut ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">Sign out of MuscleAtlas?</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirmSignOut(false)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => { signOut(); setConfirmSignOut(false) }}>Sign Out</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setConfirmSignOut(true)}>Sign Out</Button>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Sign in to sync your profile across devices</p>
        )}
      </div>
    </div>
  )
}

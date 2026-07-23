'use client'

import { useProfile } from '@/contexts/ProfileContext'
import { useAuth } from '@/contexts/AuthContext'
import { ACTIVITY_LEVEL_LABELS, WORKOUT_GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dumbbell, Ruler, Weight, Brain, Flame, ArrowLeft, Activity, Target, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { Gender, ActivityLevel, WorkoutGoal } from '@/types/profile'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile, bmr, tdee, isProfileComplete } = useProfile()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name || '')
  const [age, setAge] = useState(profile.age?.toString() || '')
  const [weight, setWeight] = useState(profile.weight?.toString() || '')
  const [height, setHeight] = useState(profile.height?.toString() || '')

  const handleSave = () => {
    updateProfile({
      name: name || undefined,
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    })
    setEditing(false)
  }

  const bmi = profile.weight && profile.height
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : null

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">
              {user ? user.email : 'Local profile'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
          )}
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={profile.gender || ''}
                  onValueChange={v => updateProfile({ gender: v as Gender || undefined })}
                >
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Select
                  value={profile.experience || ''}
                  onValueChange={v => updateProfile({ experience: v as typeof profile.experience })}
                >
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
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

      <Card id="body-stats">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4" /> Body Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Weight ({profile.weightUnit || 'kg'})</Label>
                <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
              </div>
              <div className="space-y-2">
                <Label>Height ({profile.heightUnit || 'cm'})</Label>
                <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground">Weight</span><p>{profile.weight ? `${profile.weight} ${profile.weightUnit || 'kg'}` : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">Height</span><p>{profile.height ? `${profile.height} ${profile.heightUnit || 'cm'}` : 'Not set'}</p></div>
              <div><span className="text-muted-foreground">BMI</span><p>{bmi || '—'}</p></div>
              <div><span className="text-muted-foreground">Activity Level</span><p>{profile.activityLevel ? ACTIVITY_LEVEL_LABELS[profile.activityLevel] : 'Not set'}</p></div>
            </div>
          )}

          {!editing && (
            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={profile.activityLevel || ''}
                onValueChange={v => updateProfile({ activityLevel: v as ActivityLevel || undefined })}
              >
                <SelectTrigger><SelectValue placeholder="Select activity level" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_LEVEL_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {bmr && tdee && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4" /> Metabolism
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Brain className="w-3 h-3" /> BMR
                </div>
                <p className="text-lg font-bold">{bmr}</p>
                <p className="text-[10px] text-muted-foreground">kcal/day</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Flame className="w-3 h-3" /> TDEE
                </div>
                <p className="text-lg font-bold">{tdee}</p>
                <p className="text-[10px] text-muted-foreground">kcal/day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" /> Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Workout Goal</Label>
            <Select
              value={profile.fitnessGoal || ''}
              onValueChange={v => updateProfile({ fitnessGoal: v as WorkoutGoal || undefined })}
            >
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
            <Select
              value={(profile.trainingDays || 3).toString()}
              onValueChange={v => updateProfile({ trainingDays: parseInt(v) })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <SelectItem key={d} value={d.toString()}>{d} day{d > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-center pb-8">
        {user ? (
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        ) : (
          <p className="text-sm text-muted-foreground">Sign in to sync your profile across devices</p>
        )}
      </div>
    </div>
  )
}

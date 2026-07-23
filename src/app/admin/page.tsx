'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Shield, Search, Ban, CheckCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

interface ManagedUser {
  id: string
  email?: string
  role?: string
  onboarding_complete?: boolean
  created_at?: string
  workout_count?: number
  last_active?: string
}

export default function Admin() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null)
  const [newRole, setNewRole] = useState('')
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)
  const [syncReport, setSyncReport] = useState<string>('')

  const checkAdmin = useCallback(async () => {
    if (!user) { setIsAdmin(false); return }
    const { data, error } = await (supabase as any).from('user_profiles').select('role').eq('id', user.id).single()
    if (error) { setIsAdmin(false); router.push('/app'); return }
    const admin = data?.role === 'admin'
    setIsAdmin(admin)
    if (!admin) router.push('/app')
  }, [user, router])

  useEffect(() => { checkAdmin() }, [checkAdmin])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const { data: profiles, error } = await (supabase as any).from('user_profiles').select('*').limit(100)
    if (error) { console.error('Failed to load users:', error); setLoading(false); return }
    if (profiles) setUsers(profiles.map((p: any) => ({ id: p.user_id, email: p.email || p.username, role: p.role, onboarding_complete: p.onboarding_complete, created_at: p.created_at })))
    setLoading(false)
  }, [])

  useEffect(() => { if (isAdmin) loadUsers() }, [isAdmin, loadUsers])

  const updateRole = async () => {
    if (!selectedUser || !newRole) return
    const { error } = await (supabase as any).from('user_profiles').update({ role: newRole }).eq('id', selectedUser.id)
    if (error) { toast.error(error.message); return }
    toast.success(`Role updated to ${newRole}`)
    setSelectedUser(null)
    loadUsers()
  }

  const suspendUser = async (userId: string) => {
    const { error } = await (supabase as any).from('user_profiles').update({ role: 'suspended' }).eq('id', userId)
    if (error) { toast.error(error.message); return }
    toast.success('User suspended')
    loadUsers()
  }

  const runSyncCheck = async () => {
    setSyncReport('Running sync health check...')
    const results: string[] = []
    let total = 0, healthy = 0
    for (const u of users.slice(0, 10)) {
      total++
      const { data: workouts, error } = await (supabase as any).from('workout_sessions').select('id').eq('user_id', u.id).limit(1)
      if (!error && workouts) healthy++
    }
    results.push(`Checked ${total} users, ${healthy} have workout data`)
    setSyncReport(results.join('\n'))
  }

  if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin" /></div>
  if (isAdmin === false) return null

  const filtered = users.filter(u => (u.email || '').toLowerCase().includes(search.toLowerCase()) || u.id.includes(search))

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadUsers}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
            <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
              <DialogTrigger asChild><Button variant="outline" size="sm"><Activity className="w-4 h-4 mr-1" /> Sync Health</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Sync Health Report</DialogTitle></DialogHeader>
                <pre className="text-xs whitespace-pre-wrap bg-muted p-4 rounded max-h-60 overflow-y-auto">{syncReport || 'Click "Run Check" to start'}</pre>
                <Button onClick={runSyncCheck} className="w-full">Run Check</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <Badge variant="secondary" className="self-center">{users.length} users</Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Joined</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Onboarding</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 max-w-[200px] truncate">{u.email || 'No email'}</td>
                      <td className="p-3">
                        <Badge variant={u.role === 'admin' ? 'default' : u.role === 'suspended' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {u.role || 'user'}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '\u2014'}</td>
                      <td className="p-3 hidden md:table-cell">
                        {u.onboarding_complete ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7" onClick={() => setSelectedUser(u)}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Manage User</DialogTitle></DialogHeader>
                              <div className="space-y-4">
                                <div><Label>User ID</Label><p className="text-xs text-muted-foreground break-all">{u.id}</p></div>
                                <div><Label>Email</Label><p className="text-sm">{u.email || 'N/A'}</p></div>
                                <div className="space-y-1">
                                  <Label>Role</Label>
                                  <div className="flex gap-2">
                                    <Input value={newRole || u.role || 'user'} onChange={e => setNewRole(e.target.value)} />
                                    <Button size="sm" onClick={updateRole}>Save</Button>
                                  </div>
                                </div>
                                {(u.role !== 'suspended') && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm"><Ban className="w-4 h-4 mr-1" /> Suspend</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Suspend User?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This user will be unable to sign in. Their data will be preserved.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => suspendUser(u.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Suspend</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



# Security Fix Plan - Shared Workouts Table

## Problem Summary

The `shared_workouts` table has security gaps that could allow malicious users to modify or delete workout plans created by others.

| Issue | Risk Level | Description |
|-------|------------|-------------|
| No UPDATE protection | Medium | Anyone could modify shared workout data |
| No DELETE protection | Medium | Anyone could delete shared workouts |

## Context

This is a **public fitness app without user authentication**. The sharing feature is designed for:
- Anonymous users creating shareable workout/diet plans
- Anyone viewing shared plans via short URLs (e.g., `/shared/fK4Hv4NC`)

Since there are no user accounts, we cannot implement ownership-based access control. The appropriate approach is to **deny all UPDATE and DELETE operations** to prevent tampering.

---

## Implementation Plan

### Step 1: Add Restrictive UPDATE Policy

Create a policy that prevents anyone from updating shared workouts:

```sql
CREATE POLICY "No one can update shared workouts" 
ON public.shared_workouts 
FOR UPDATE 
USING (false);
```

This completely blocks UPDATE operations since there's no legitimate reason to modify a shared workout after creation.

### Step 2: Add Restrictive DELETE Policy

Create a policy that prevents anyone from deleting shared workouts:

```sql
CREATE POLICY "No one can delete shared workouts" 
ON public.shared_workouts 
FOR DELETE 
USING (false);
```

This protects shared workouts from being deleted by malicious users.

### Step 3: Update Security Findings

After applying the fixes, mark the security findings as resolved.

---

## Technical Details

### Database Migration SQL

```sql
-- Prevent any updates to shared workouts
CREATE POLICY "No one can update shared workouts" 
ON public.shared_workouts 
FOR UPDATE 
USING (false);

-- Prevent any deletions of shared workouts
CREATE POLICY "No one can delete shared workouts" 
ON public.shared_workouts 
FOR DELETE 
USING (false);
```

### Why Not Add User Authentication?

Adding authentication would be a significant architectural change:
- Would require login/signup flows
- Would break the current anonymous sharing model
- May not align with the app's intended use case (quick, frictionless sharing)

The current approach (public create + view, no modify + delete) is appropriate for this type of public tool.

---

## Files to Modify

| Area | Action |
|------|--------|
| Database | Add 2 RLS policies via migration tool |
| Security Findings | Delete resolved findings |

---

## Security Posture After Fix

| Operation | Policy | Who Can Do It |
|-----------|--------|---------------|
| INSERT | `true` | Anyone (create new shares) |
| SELECT | `true` | Anyone (view shared workouts) |
| UPDATE | `false` | No one (immutable after creation) |
| DELETE | `false` | No one (permanent shares) |

This creates an **append-only** model that's appropriate for public sharing without authentication.

---

## Note on INSERT Policy Warning

The linter warns about `WITH CHECK (true)` on INSERT, but this is **intentional** for a public sharing feature. I'll acknowledge this finding as accepted behavior since:
1. No authentication exists
2. The INSERT is required for the sharing feature to work
3. Shared workouts contain no sensitive data


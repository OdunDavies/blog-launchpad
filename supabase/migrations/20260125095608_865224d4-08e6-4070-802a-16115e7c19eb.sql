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
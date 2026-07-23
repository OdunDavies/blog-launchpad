import { supabase } from '@/integrations/supabase/client';

type EmailTemplate = 'welcome' | 'workout-reminder';

interface EmailOptions {
  to: string;
  template?: EmailTemplate;
  data?: Record<string, string>;
  subject?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-email', { body: options });
    if (error) {
      console.error('Failed to send email:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  return sendEmail({ to: email, template: 'welcome', data: { name: name || 'Athlete' } });
}

export async function sendWorkoutReminder(email: string, streak?: number) {
  return sendEmail({ to: email, template: 'workout-reminder', data: { streak: String(streak || 0) } });
}

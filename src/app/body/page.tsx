import { redirect } from 'next/navigation'

export default function BodyRedirect() {
  redirect('/profile#body-stats')
}

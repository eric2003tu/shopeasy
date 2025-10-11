import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to the admin dashboard index — the sidebar lives in the admin layout.
  redirect('/admin/dashboard');
}

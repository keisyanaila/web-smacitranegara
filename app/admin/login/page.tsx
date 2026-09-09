import { redirect } from 'next/navigation';

// Kalau sudah login, layout menampilkan panel; halaman ini cukup mengarahkan.
// Kalau belum login, layout sudah menampilkan form login lebih dulu.
export default function AdminLoginPage() {
  redirect('/admin/dashboard');
}

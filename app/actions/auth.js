'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function registerPartner(formData) {
  // This is handled by the API route now
  return { success: true };
}

export async function loginUser(formData) {
  // This is handled by the API route now
  return { success: true };
}

export async function logoutUser() {
  const cookieStore = cookies();
  cookieStore.delete('token');
  redirect('/login');
}
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()


  const path = request.nextUrl.pathname
  const isAuthFreeRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/blogs/')

  if (!isAuthFreeRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated, enforce therapist profile completion gate before protected routes
  if (user) {
    try {
      // Read completion flag from auth metadata
      let therapistProfileCompleted = false
      try {
        therapistProfileCompleted = !!(user as any).user_metadata?.therapistProfileCompleted
      } catch {}

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('role, name, phone_number, company_name')
        .eq('id', user.id)
        .maybeSingle()

      const role = profileRow?.role

      if (role === 'therapist') {
        const { data: therapistRow } = await supabase
          .from('therapists')
          .select('id, years_experience')
          .eq('id', user.id)
          .maybeSingle()

        const needsTherapistDetails = !therapistProfileCompleted && (!profileRow?.name || !profileRow?.phone_number || !profileRow?.company_name || !therapistRow)

        const isOnTherapistDetails = path.startsWith('/therapist/details')
        const isAuthFree = path.startsWith('/login') || path.startsWith('/register')
        if (needsTherapistDetails && !isOnTherapistDetails && !isAuthFree) {
          const url = request.nextUrl.clone()
          url.pathname = '/therapist/details'
          return NextResponse.redirect(url)
        }
      }
    } catch (e) {
      // Fail open to avoid redirect loops on transient DB errors
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

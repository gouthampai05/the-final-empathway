'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/supabase/server'

type RegisterPayload = { email: string; password: string; role: 'therapist' | 'patient' }

export async function registerAndLogin(payload: RegisterPayload): Promise<{ message: string; redirectTo: string }>{
	const { email, password, role } = payload

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
	if (!serviceKey) {
		throw new Error('Service role key not configured')
	}

	const admin = createAdminClient(supabaseUrl, serviceKey)

	// 1) Create and confirm user immediately
	const { data: created, error: createErr } = await admin.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: { role }
	})
	if (createErr || !created.user) {
		throw new Error(createErr?.message || 'Failed to create user')
	}

	const userId = created.user.id

	// 2) Sign in on the server to set auth cookies
	const serverClient = await createServerSupabase()
	const { error: signInErr } = await serverClient.auth.signInWithPassword({ email, password })
	if (signInErr) {
		throw new Error(signInErr.message)
	}

	// 3) Upsert profile and role rows using admin client
	const { error: profileError } = await admin
		.from('profiles')
		.upsert({
			id: userId,
			email,
			name: '',
			phone_number: '',
			company_name: '',
			role,
			profile_pic_url: null,
		}, { onConflict: 'id' })
	if (profileError) {
		throw new Error(profileError.message)
	}

	if (role === 'therapist') {
		const { error: tErr } = await admin
			.from('therapists')
			.upsert({ id: userId, years_experience: 0, expertise: [], bio: null }, { onConflict: 'id' })
		if (tErr) throw new Error(tErr.message)
	} else if (role === 'patient') {
		const { error: pErr } = await admin
			.from('patients')
			.upsert({ id: userId }, { onConflict: 'id' })
		if (pErr) throw new Error(pErr.message)
	}

	return {
		message: 'Account created and logged in',
		redirectTo: role === 'therapist' ? '/therapist/details' : '/patient/complete-profile'
	}
}







import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';

const BodySchema = z.object({
  submission_id: z.string().uuid(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: submission, error: subErr } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', parsed.data.submission_id)
      .maybeSingle();
    if (subErr) throw subErr;
    if (!submission) {
      return new Response(JSON.stringify({ error: 'submission_not_found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: page } = await supabase
      .from('contact_page')
      .select('notification_email')
      .eq('singleton', true)
      .maybeSingle();

    const to = page?.notification_email?.trim();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!to) {
      return new Response(JSON.stringify({ skipped: 'no_notification_email' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!RESEND_API_KEY) {
      console.log('RESEND_API_KEY not set — skipping email send');
      return new Response(JSON.stringify({ skipped: 'no_resend_key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111">
        <h2>New contact form submission</h2>
        <p><b>Name:</b> ${escapeHtml(submission.name ?? '')}</p>
        <p><b>Email:</b> ${escapeHtml(submission.email ?? '')}</p>
        <p><b>Phone:</b> ${escapeHtml(submission.phone ?? '')}</p>
        <p><b>Area of interest:</b> ${escapeHtml(submission.area ?? '')}</p>
        <p><b>Message:</b><br/>${escapeHtml(submission.message ?? '').replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Received ${new Date(submission.created_at).toUTCString()}</p>
      </div>
    `;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SBS Contact <onboarding@resend.dev>',
        to: [to],
        reply_to: submission.email ?? undefined,
        subject: `New contact inquiry from ${submission.name ?? 'website'}`,
        html,
      }),
    });

    if (!resp.ok) {
      const details = await resp.text();
      console.error(`Resend send failed [${resp.status}]: ${details}`);
      return new Response(
        JSON.stringify({ error: 'resend_failed', status: resp.status, details }),
        { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ sent: true, to }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-contact-notification error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

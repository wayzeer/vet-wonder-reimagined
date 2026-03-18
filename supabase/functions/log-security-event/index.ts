import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = ['https://vetwonder.es', 'https://www.vetwonder.es'];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Simple hash function for IP anonymization
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.slice(0, 10));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const { eventType, source, details } = await req.json();

    // Validate required fields
    if (!eventType || !source) {
      // Return 200 silently - don't give bots any hints
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Valid event types
    const validEvents = ['honeypot_triggered', 'rate_limit_hit', 'suspicious_pattern', 'validation_failed'];
    if (!validEvents.includes(eventType)) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get and hash IP for pattern detection while maintaining privacy
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';
    const ipHash = await hashIP(ip);

    // Get user agent
    const userAgent = req.headers.get('user-agent') || details?.userAgent || 'unknown';

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert security log
    const { error } = await supabase
      .from('security_logs')
      .insert({
        event_type: eventType,
        source: source,
        ip_hash: ipHash,
        user_agent: userAgent.slice(0, 500), // Limit length
        details: {
          ...details,
          timestamp: new Date().toISOString(),
        },
      });

    if (error) {
      console.error('Error logging security event:', error);
    } else {
      console.log(`Security event logged: ${eventType} from ${source} (IP hash: ${ipHash})`);
    }

    // Always return success - don't reveal anything to potential attackers
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in log-security-event:', error);
    
    // Still return 200 - never reveal errors to potential attackers
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' },
      status: 200,
    });
  }
});

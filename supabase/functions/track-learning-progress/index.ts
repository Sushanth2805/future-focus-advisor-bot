
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { resourceId, resourceType, title, url, completed } = await req.json()

    const client = new MongoClient()
    await client.connect(Deno.env.get('MONGODB_CONNECTION_STRING')!)
    const db = client.database('career_counselor')
    const learningProgress = db.collection('learning_progress')

    const progressData = {
      userId: user.id,
      userEmail: user.email,
      resourceId,
      resourceType,
      title,
      url,
      completed: completed || false,
      viewedAt: new Date(),
      updatedAt: new Date()
    }

    // Upsert the progress
    await learningProgress.replaceOne(
      { userId: user.id, resourceId },
      progressData,
      { upsert: true }
    )
    
    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error tracking learning progress:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to track learning progress' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

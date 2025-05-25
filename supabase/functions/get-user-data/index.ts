
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

    const client = new MongoClient()
    await client.connect(Deno.env.get('MONGODB_CONNECTION_STRING')!)
    const db = client.database('career_counselor')
    
    const assessments = db.collection('assessments')
    const chatSessions = db.collection('chat_sessions')
    const learningProgress = db.collection('learning_progress')

    // Get latest assessment
    const latestAssessment = await assessments.findOne(
      { userId: user.id },
      { sort: { createdAt: -1 } }
    )

    // Get assessment count
    const assessmentCount = await assessments.countDocuments({ userId: user.id })

    // Get chat session count
    const chatSessionCount = await chatSessions.countDocuments({ userId: user.id })

    // Get learning progress count
    const resourcesViewedCount = await learningProgress.countDocuments({ userId: user.id })

    await client.close()

    return new Response(
      JSON.stringify({ 
        latestAssessment,
        stats: {
          assessmentCount,
          chatSessionCount,
          resourcesViewedCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error fetching user data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

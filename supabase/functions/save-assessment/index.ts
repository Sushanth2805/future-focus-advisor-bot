
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

    const { answers, careerPath } = await req.json()

    const client = new MongoClient()
    await client.connect(Deno.env.get('MONGODB_CONNECTION_STRING')!)
    const db = client.database('career_counselor')
    const assessments = db.collection('assessments')

    const assessmentData = {
      userId: user.id,
      userEmail: user.email,
      answers,
      careerPath,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await assessments.insertOne(assessmentData)
    
    await client.close()

    return new Response(
      JSON.stringify({ 
        success: true, 
        assessmentId: result.toString(),
        data: assessmentData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error saving assessment:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save assessment' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

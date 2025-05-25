
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

    const { messages, sessionId } = await req.json()
    console.log('Saving chat session for user:', user.id)

    const connectionString = Deno.env.get('MONGODB_CONNECTION_STRING')
    if (!connectionString) {
      console.error('MongoDB connection string not found')
      return new Response(JSON.stringify({ error: 'Database configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let client
    try {
      client = new MongoClient()
      await client.connect(connectionString)
      console.log('MongoDB connected for chat session save')
      
      const db = client.database('career_counselor')
      const chatSessions = db.collection('chat_sessions')

      const sessionData = {
        sessionId: sessionId || crypto.randomUUID(),
        userId: user.id,
        userEmail: user.email,
        messages,
        timestamp: new Date(),
        updatedAt: new Date()
      }

      // Upsert the session
      await chatSessions.replaceOne(
        { sessionId: sessionData.sessionId },
        sessionData,
        { upsert: true }
      )
      
      console.log('Chat session saved:', sessionData.sessionId)

      return new Response(JSON.stringify({ 
        success: true, 
        sessionId: sessionData.sessionId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (mongoError) {
      console.error('MongoDB error during chat session save:', mongoError)
      return new Response(JSON.stringify({ error: 'Failed to save chat session to database' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } finally {
      if (client) {
        try {
          await client.close()
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

  } catch (error) {
    console.error('Error saving chat session:', error)
    return new Response(JSON.stringify({ error: 'Failed to save chat session' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

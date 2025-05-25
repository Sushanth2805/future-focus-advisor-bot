
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

    console.log('User authenticated:', user.id)

    // Initialize with fallback data
    let userData = {
      latestAssessment: null,
      stats: {
        assessmentCount: 0,
        chatSessionCount: 0,
        resourcesViewedCount: 0
      }
    }

    const connectionString = Deno.env.get('MONGODB_CONNECTION_STRING')
    if (!connectionString) {
      console.log('MongoDB connection string not found, returning fallback data')
      return new Response(JSON.stringify(userData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let client
    try {
      client = new MongoClient()
      console.log('Attempting to connect to MongoDB...')
      await client.connect(connectionString)
      console.log('MongoDB connected successfully')
      
      const db = client.database('career_counselor')
      const assessments = db.collection('assessments')
      const chatSessions = db.collection('chat_sessions')
      const learningProgress = db.collection('learning_progress')

      // Get latest assessment
      try {
        const latestAssessment = await assessments.findOne(
          { userId: user.id },
          { sort: { createdAt: -1 } }
        )
        if (latestAssessment) {
          userData.latestAssessment = latestAssessment
        }
        console.log('Latest assessment retrieved')
      } catch (error) {
        console.error('Error fetching latest assessment:', error)
      }

      // Get stats with individual error handling
      try {
        const assessmentCount = await assessments.countDocuments({ userId: user.id })
        userData.stats.assessmentCount = assessmentCount
        console.log('Assessment count:', assessmentCount)
      } catch (error) {
        console.error('Error counting assessments:', error)
      }

      try {
        const chatSessionCount = await chatSessions.countDocuments({ userId: user.id })
        userData.stats.chatSessionCount = chatSessionCount
        console.log('Chat session count:', chatSessionCount)
      } catch (error) {
        console.error('Error counting chat sessions:', error)
      }

      try {
        const resourcesViewedCount = await learningProgress.countDocuments({ userId: user.id })
        userData.stats.resourcesViewedCount = resourcesViewedCount
        console.log('Resources viewed count:', resourcesViewedCount)
      } catch (error) {
        console.error('Error counting learning progress:', error)
      }

    } catch (mongoError) {
      console.error('MongoDB connection/operation error:', mongoError)
      // Continue with fallback data instead of throwing
    } finally {
      if (client) {
        try {
          await client.close()
          console.log('MongoDB connection closed')
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

    return new Response(JSON.stringify(userData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('General error in get-user-data function:', error)
    
    // Return fallback data instead of error
    const fallbackData = {
      latestAssessment: null,
      stats: {
        assessmentCount: 0,
        chatSessionCount: 0,
        resourcesViewedCount: 0
      }
    }

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

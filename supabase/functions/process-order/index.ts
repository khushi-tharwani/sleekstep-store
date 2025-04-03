
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get auth user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse the request body
    const { orderId } = await req.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing order ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get the order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError) {
      return new Response(
        JSON.stringify({ error: 'Order not found', details: orderError }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Check if the order belongs to the authenticated user
    if (order.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to order' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    // Example: Integrate with an external payment processing API
    // This is a mock implementation - you would replace this with an actual API call
    const paymentResult = await processPayment(order)

    // Update order status based on payment result
    if (paymentResult.success) {
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

      if (updateError) {
        throw updateError
      }

      // Send a notification to the customer
      await sendOrderConfirmation(order, user.email)

      return new Response(
        JSON.stringify({
          message: 'Order processed successfully',
          orderStatus: 'processing',
          paymentId: paymentResult.paymentId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          error: 'Payment processing failed',
          details: paymentResult.error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error('Error processing order:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Mock function for payment processing
async function processPayment(order: any) {
  // In a real implementation, you would integrate with a payment gateway API
  // For demonstration, we'll simulate a successful payment
  console.log('Processing payment for order:', order.id)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`
  }
}

// Mock function for sending order confirmation
async function sendOrderConfirmation(order: any, email: string) {
  // In a real implementation, you would integrate with an email service
  console.log(`Sending order confirmation to ${email} for order ${order.id}`)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true
  }
}


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
    // Log request info for debugging
    console.log("Processing order request received");
    
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
      console.log("Unauthorized request - no user found");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data:", requestData);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const { orderId } = requestData;

    if (!orderId) {
      console.log("Missing order ID in request");
      return new Response(
        JSON.stringify({ error: 'Missing order ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get the order details
    console.log("Fetching order details for ID:", orderId);
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError) {
      console.error("Error fetching order:", orderError);
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
      console.log("Unauthorized access to order. Order user:", order.user_id, "Request user:", user.id);
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to order' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    console.log("Order found, proceeding with payment processing");
    
    // Fetch shoe data from external API
    try {
      // Using the Shoe API to get product information and inventory data
      const shoeResponse = await fetch('https://api.sampleapis.com/shoes/sneakers');
      
      if (!shoeResponse.ok) {
        throw new Error(`External API responded with status: ${shoeResponse.status}`);
      }
      
      const shoeData = await shoeResponse.json();
      console.log("Retrieved shoe data from external API:", shoeData.length, "items");
      
      // Process the external API data
      // Here we could update inventory, validate prices, etc.
      const externalProducts = shoeData.map((shoe: any) => ({
        id: shoe.id,
        name: shoe.name,
        brand: shoe.brand || 'Unknown',
        year: shoe.releaseDate || 'Unknown',
        price: shoe.retailPrice || 0
      }));
      
      console.log("Processed external product data:", externalProducts.slice(0, 3));
      
      // You could do something with this data like verify pricing or check stock
      // For demonstration purposes, we're just logging it
    } catch (apiError) {
      console.error("Error fetching external shoe data:", apiError);
      // Continue processing the order even if external API call fails
    }

    // Example: Integrate with an external payment processing API
    // This is a mock implementation - you would replace this with an actual API call
    const paymentResult = await processPayment(order);

    // Update order status based on payment result
    if (paymentResult.success) {
      console.log("Payment processed successfully, updating order status");
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

      if (updateError) {
        console.error("Error updating order status:", updateError);
        throw updateError;
      }

      // Send a notification to the customer
      await sendOrderConfirmation(order, user.email);

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
      console.log("Payment processing failed");
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
    console.error('Error processing order:', error);
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
  console.log('Processing payment for order:', order.id);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the order details for debugging
  console.log('Order details:', {
    id: order.id,
    total: order.total,
    payment_method: order.payment_method
  });
  
  return {
    success: true,
    paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`
  }
}

// Mock function for sending order confirmation
async function sendOrderConfirmation(order: any, email: string) {
  // In a real implementation, you would integrate with an email service
  console.log(`Sending order confirmation to ${email} for order ${order.id}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true
  }
}

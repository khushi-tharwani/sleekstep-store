
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get order data from request
    const { orderId } = await req.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found", details: orderError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user shipping address
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', order.address_id)
      .single();

    if (addressError || !address) {
      console.error("Error fetching address:", addressError);
      return new Response(
        JSON.stringify({ error: "Address not found", details: addressError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simulate external API call to shoe inventory system
    console.log("Connecting to external shoe inventory API...");
    
    // This would be a real API call in a production environment
    // For example: const response = await fetch("https://api.shoeinventory.com/orders", {...})
    
    // Simulate API processing
    const externalAPIResponse = {
      success: true,
      orderId: orderId,
      trackingNumber: `SHOE-${Math.floor(Math.random() * 1000000)}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Order successfully processed by shoe inventory system"
    };
    
    console.log("External API response:", externalAPIResponse);

    // Update order with tracking information
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
        // You could store external API details in a metadata column
        // metadata: { tracking: externalAPIResponse.trackingNumber, estimatedDelivery: externalAPIResponse.estimatedDelivery }
      })
      .eq('id', orderId);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order", details: updateError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order processed successfully",
        orderId: orderId,
        externalProcessing: externalAPIResponse
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

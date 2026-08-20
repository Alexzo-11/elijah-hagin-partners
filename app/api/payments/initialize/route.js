import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

// ✅ Ensure this is a named export for POST
export async function POST(request) {
  try {
    console.log('💰 Payment initialization started');
    
    // Get authenticated user
    const user = await getAuthUser();
    if (!user) {
      console.log('❌ Unauthorized: No user found');
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    console.log('👤 User:', user.email, 'Role:', user.role);

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (err) {
      console.log('❌ Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { amount, email, paymentMethod = 'paystack' } = body;

    // Validate amount
    if (!amount || amount < 100) {
      console.log('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Amount must be at least ₦100' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('✅ Database connected');

    // Get partner
    const partner = await Partner.findById(user.id);
    if (!partner) {
      console.log('❌ Partner not found for user:', user.id);
      return NextResponse.json(
        { error: 'Partner profile not found' },
        { status: 404 }
      );
    }

    console.log('📦 Partner found:', partner.email);

    // Generate unique reference
    const reference = `EXO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    console.log('🔑 Generated reference:', reference);

    // Create payment record with 'pending' status
    const payment = new Payment({
      partnerId: partner._id,
      partnerEmail: partner.email,
      reference: reference,
      amount: amount,
      status: 'pending',
      method: paymentMethod,
      createdAt: new Date(),
    });

    await payment.save();
    console.log('💾 Payment record created:', payment._id);

    // Check Paystack secret key
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.log('❌ PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    // Initialize Paystack transaction
    console.log('🚀 Initializing Paystack transaction...');
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || partner.email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference: reference,
        callback_url: `${process.env.NEXTAUTH_URL || 'https://elijah-hagin-partners.vercel.app'}/partner/payments/success?reference=${reference}`,
        metadata: {
          partnerId: partner._id.toString(),
          partnerEmail: partner.email,
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log('📡 Paystack response status:', paystackResponse.status);

    if (!paystackResponse.ok || !paystackData.status) {
      console.log('❌ Paystack initialization failed:', paystackData.message);
      
      // Mark payment as failed
      payment.status = 'failed';
      await payment.save();
      
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    console.log('✅ Paystack initialized successfully');
    console.log('🔗 Authorization URL:', paystackData.data.authorization_url);

    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: reference,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('❌ Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}

// ✅ Add OPTIONS handler for CORS preflight if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
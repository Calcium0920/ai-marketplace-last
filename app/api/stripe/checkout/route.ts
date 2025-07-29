import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 })
    }

    // Stripe Checkoutセッション作成
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: item.title,
            description: item.description,
            images: [], // 後で商品画像URL追加可能
          },
          unit_amount: item.price,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.email,
        itemIds: items.map((item: any) => item.id).join(','),
      },
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json(
      { error: '決済処理でエラーが発生しました' },
      { status: 500 }
    )
  }
}
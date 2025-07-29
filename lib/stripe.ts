import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// フロントエンド用
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// バックエンド用
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // 最新のAPIバージョンに更新
})
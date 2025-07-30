'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import ReviewSection from '@/components/ReviewSection'

interface Product {
  id: string | number
  title: string
  description: string
  price: number
  category: string
  icon: string
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: string
  creator?: string
  endpointUrl?: string
}

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  toolId: string
  verified: boolean
  helpful: number
}

export default function ToolDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [tool, setTool] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [cart, setCart] = useState<Product[]>([])

  const toolId = params.id as string

  useEffect(() => {
    if (toolId) {
      loadToolDetail()
      loadReviews()
    }
  }, [toolId])

  const loadToolDetail = async () => {
    try {
      // まずSupabaseから取得を試行
      const { data: supabaseTools } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .eq('status', 'approved')
        .limit(1)

      if (supabaseTools && supabaseTools.length > 0) {
        const supabaseTool = supabaseTools[0]
        const formattedTool: Product = {
          id: supabaseTool.id,
          title: supabaseTool.title,
          description: supabaseTool.description,
          price: supabaseTool.price,
          category: supabaseTool.category,
          icon: getCategoryIcon(supabaseTool.category),
          rating: 5,
          reviewCount: 0,
          tags: supabaseTool.tags || [supabaseTool.category],
          createdAt: supabaseTool.created_at,
          creator: supabaseTool.creator,
          endpointUrl: supabaseTool.endpoint_url
        }
        setTool(formattedTool)
        setLoading(false)
        return
      }

      // フォールバック: デフォルト商品から検索
      const defaultProducts: Product[] = [
        {
          id: 1,
          title: 'スマート文章校正AI',
          description: '日本語の文章を自動で校正・改善してくれるAIツール。ビジネス文書からブログ記事まで幅広く対応。高精度な文法チェックと自然な表現提案で、あなたの文章をプロフェッショナルレベルに向上させます。',
          price: 2980,
          category: '文章作成',
          icon: '🧠',
          rating: 5,
          reviewCount: 127,
          tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語'],
          createdAt: '2024-01-15',
          creator: 'AI Solutions Inc.',
          endpointUrl: 'https://api.example.com/text-correction'
        },
        {
          id: 2,
          title: 'データ分析アシスタント',
          description: 'CSVファイルをアップロードするだけで、自動でグラフ作成や統計分析を行うAIツール。複雑なデータも視覚的に分かりやすく表現します。',
          price: 4500,
          category: 'データ分析',
          icon: '📊',
          rating: 4,
          reviewCount: 89,
          tags: ['データ分析', 'グラフ', '統計', 'CSV', '自動化'],
          createdAt: '2024-01-20',
          creator: 'DataTech Solutions',
          endpointUrl: 'https://api.example.com/data-analysis'
        },
        {
          id: 3,
          title: 'ロゴ生成AI',
          description: '会社名やキーワードを入力するだけで、プロ品質のロゴデザインを自動生成。複数のデザイン案から選択可能で、ベクター形式でダウンロードできます。',
          price: 1980,
          category: 'デザイン',
          icon: '🎨',
          rating: 5,
          reviewCount: 203,
          tags: ['デザイン', 'ロゴ', 'ブランディング', 'AI', '自動生成'],
          createdAt: '2024-01-10',
          creator: 'Creative AI Studio',
          endpointUrl: 'https://api.example.com/logo-generator'
        },
        {
          id: 4,
          title: 'カスタマーサポートBot',
          description: 'よくある質問に自動回答するチャットボット。Webサイトに簡単に組み込めて、24時間365日顧客対応が可能になります。',
          price: 3500,
          category: 'チャットボット',
          icon: '💬',
          rating: 4,
          reviewCount: 156,
          tags: ['チャットボット', 'サポート', '自動化', 'FAQ', 'ビジネス'],
          createdAt: '2024-01-25',
          creator: 'Bot Solutions Ltd.',
          endpointUrl: 'https://api.example.com/support-bot'
        },
        {
          id: 5,
          title: '学習計画AI',
          description: '目標と現在のレベルを入力すると、最適な学習スケジュールを自動作成。進捗管理機能付きで、効率的な学習をサポートします。',
          price: 2200,
          category: '教育',
          icon: '📚',
          rating: 5,
          reviewCount: 95,
          tags: ['教育', '学習', '計画', 'スケジュール', 'AI'],
          createdAt: '2024-02-01',
          creator: 'EduTech Innovations',
          endpointUrl: 'https://api.example.com/study-planner'
        },
        {
          id: 6,
          title: 'SEO分析ツール',
          description: 'WebサイトのSEO状況を自動分析し、改善提案を行うAIツール。競合分析やキーワード提案も含む包括的なSEO支援を提供します。',
          price: 5980,
          category: 'SEO',
          icon: '🔍',
          rating: 4,
          reviewCount: 74,
          tags: ['SEO', '分析', 'マーケティング', 'Web', '最適化'],
          createdAt: '2024-01-30',
          creator: 'SEO Masters Inc.',
          endpointUrl: 'https://api.example.com/seo-analyzer'
        }
      ]

      // localStorage から承認済みツールを取得
      const approvedTools = JSON.parse(localStorage.getItem('approvedTools') || '[]')
      const formattedApproved: Product[] = approvedTools.map((t: unknown, index: number) => {
        const tool = t as any
        return {
          id: `approved_${index}`,
          title: tool.title,
          description: tool.description,
          price: tool.price,
          category: tool.category,
          icon: getCategoryIcon(tool.category),
          rating: 5,
          reviewCount: 0,
          tags: tool.tags || [tool.category],
          createdAt: tool.createdAt || new Date().toISOString(),
          creator: tool.creator,
          endpointUrl: tool.endpointUrl
        }
      })

      // 全商品から検索
      const allProducts = [...defaultProducts, ...formattedApproved]
      const foundTool = allProducts.find(p => p.id.toString() === toolId)

      if (foundTool) {
        setTool(foundTool)
      } else {
        console.log('ツールが見つかりません:', toolId)
      }

    } catch (error) {
      console.error('ツール詳細読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = () => {
    try {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const toolReviews = allReviews
        .filter((review: unknown) => (review as any).toolId === toolId.toString())
        .map((review: unknown) => {
          const r = review as any
          return {
            id: r.id,
            userId: r.userId,
            userName: r.userName,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            toolId: r.toolId,
            verified: r.verified || false,
            helpful: r.helpful || 0
          }
        })
      setReviews(toolReviews)
    } catch (error) {
      console.error('レビュー読み込みエラー:', error)
    }
  }

  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      '文章作成': '🧠',
      'データ分析': '📊',
      'デザイン': '🎨',
      'チャットボット': '💬',
      '教育': '📚',
      'SEO': '🔍',
      'テキスト処理': '📝',
      '画像処理': '🖼️',
      '機械学習': '🤖',
      'API連携': '🔗'
    }
    return iconMap[category] || '🤖'
  }

  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const isInCart = existingCart.some((item: Product) => item.id === product.id)
    
    if (isInCart) {
      alert('既にカートに追加されています')
      return
    }
    
    const updatedCart = [...existingCart, product]
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
    alert(`${product.title}をカートに追加しました！`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">ツール詳細を読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ツールが見つかりません</h1>
          <p className="text-gray-600 mb-6">指定されたツールは存在しないか、削除された可能性があります。</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  const isInCart = cart.some(item => item.id === tool.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold">🤖 AI Marketplace</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* ツール情報セクション */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 左側：アイコンと基本情報 */}
              <div>
                <div className="text-8xl mb-6 text-center bg-gray-50 rounded-lg py-12">
                  {tool.icon}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">カテゴリ</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tool.category}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {tool.creator && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">作成者</h3>
                      <p className="text-gray-700">{tool.creator}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">公開日</h3>
                    <p className="text-gray-700">
                      {new Date(tool.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 右側：詳細情報 */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{tool.title}</h1>
                
                {/* 評価 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">
                      {'★'.repeat(Math.floor(tool.rating))}{'☆'.repeat(5-Math.floor(tool.rating))}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {tool.rating.toFixed(1)} ({tool.reviewCount + reviews.length}件のレビュー)
                    </span>
                  </div>
                </div>

                {/* 価格 */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    ¥{tool.price.toLocaleString()}
                  </span>
                </div>

                {/* 説明 */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">ツールについて</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tool.description}
                  </p>
                </div>

                {/* APIエンドポイント */}
                {tool.endpointUrl && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">APIエンドポイント</h2>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <code className="text-sm text-gray-800">{tool.endpointUrl}</code>
                    </div>
                  </div>
                )}

                {/* 購入ボタン */}
                <div className="flex gap-4">
                  <button
                    onClick={() => addToCart(tool)}
                    disabled={isInCart}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      isInCart
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isInCart ? '✓ カートに追加済み' : '🛒 カートに追加'}
                  </button>
                  
                  {session && (
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      💝 ウィッシュリスト
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* レビューセクション */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📝 レビュー ({reviews.length}件)
            </h2>
            
            {session ? (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  💡 このツールを使用したことがある場合は、レビューを投稿してください
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  レビューを投稿するには<span className="text-blue-600 font-medium">ログイン</span>が必要です
                </p>
              </div>
            )}
            
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💭</div>
                <p className="text-gray-600">まだレビューはありません</p>
                <p className="text-gray-500 text-sm mt-2">最初のレビューを投稿してみませんか？</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{review.userName}</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              ✓ 認証済み
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-13">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-3 ml-13">
                      <button className="text-gray-500 hover:text-blue-600 text-sm flex items-center gap-1">
                        👍 役に立った ({review.helpful})
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 text-sm">
                        返信
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
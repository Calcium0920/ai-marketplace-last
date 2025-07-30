'use client'
import React, { useState } from 'react'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  icon: string
}

export default function HomePage() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      title: 'スマート文章校正AI',
      description: '日本語の文章を自動で校正・改善してくれるAIツール',
      price: 2980,
      category: '文章作成',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'データ分析アシスタント',
      description: 'CSVファイルをアップロードするだけで自動分析',
      price: 4500,
      category: 'データ分析',
      icon: '📊'
    },
    {
      id: 3,
      title: 'ロゴ生成AI',
      description: 'プロ品質のロゴデザインを自動生成',
      price: 1980,
      category: 'デザイン',
      icon: '🎨'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">🤖 AI Marketplace (Clean Version)</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 AIツールマーケットプレイス
          </h2>
          <p className="text-gray-600 text-lg">
            便利なAIツールを見つけて購入しよう
          </p>
        </div>

        {/* 商品一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">
                {product.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {product.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ¥{product.price.toLocaleString()}
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  詳細を見る
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 成功メッセージ */}
        <div className="mt-12 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
          🎉 <strong>デプロイ成功！</strong> AI Marketplaceが正常に動作しています
        </div>
      </main>
    </div>
  )
}
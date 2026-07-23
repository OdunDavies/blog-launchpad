import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
import { blogPosts } from '@/data/blog-posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — MuscleAtlas',
  description: 'Fitness tips, workout guides, and training advice from the MuscleAtlas team.',
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground"><Dumbbell className="w-4 h-4 inline mr-1" />MuscleAtlas</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Blog</span>
        </nav>
        <h1 className="text-3xl font-bold mb-2">MuscleAtlas Blog</h1>
        <p className="text-muted-foreground mb-8">Training tips, science-backed advice, and workout guides</p>

        <div className="grid gap-6">
          {blogPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/50 p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold leading-none tracking-tight group-hover:text-red-500 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground">{post.description}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {post.tags.map(t => (
                    <span key={t} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

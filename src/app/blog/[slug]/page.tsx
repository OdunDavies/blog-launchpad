import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Markdown from '@/components/Markdown'
import { blogPosts, getBlogPost } from '@/data/blog-posts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Post Not Found — MuscleAtlas' }
  return {
    title: `${post.title} — MuscleAtlas`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, images: [post.image] },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> All Posts
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
            <p className="text-lg text-muted-foreground">{post.description}</p>
          </header>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
            <Markdown content={post.content} />
          </div>
        </article>
      </div>
    </div>
  )
}

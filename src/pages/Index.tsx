import Header from "@/components/Header";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import featuredImage from "@/assets/featured-article.jpg";
import article1Image from "@/assets/article-1.jpg";
import article2Image from "@/assets/article-2.jpg";
import article3Image from "@/assets/article-3.jpg";

const Index = () => {
  const featuredArticle = {
    image: featuredImage,
    category: "Lifestyle",
    title: "Finding Peace in the Quiet Moments Between",
    excerpt:
      "In our relentless pursuit of productivity, we've forgotten the art of stillness. Here's why embracing the pauses might be the key to a more fulfilling life.",
    author: "Eleanor Hayes",
    date: "Dec 28, 2025",
    readTime: "8 min read",
  };

  const articles = [
    {
      image: article1Image,
      category: "Culture",
      title: "The Rise of Third Places",
      excerpt:
        "Exploring how coffee shops, libraries, and co-working spaces are reshaping our social fabric.",
      author: "Marcus Chen",
      date: "Dec 25, 2025",
      readTime: "6 min read",
    },
    {
      image: article2Image,
      category: "Creativity",
      title: "The Lost Art of Letter Writing",
      excerpt:
        "In a digital age, putting pen to paper offers something emails never could: presence.",
      author: "Sofia Martinez",
      date: "Dec 22, 2025",
      readTime: "5 min read",
    },
    {
      image: article3Image,
      category: "Wellness",
      title: "Walking as Meditation",
      excerpt:
        "How a daily practice of mindful walking transformed my relationship with movement and thought.",
      author: "James Wright",
      date: "Dec 19, 2025",
      readTime: "7 min read",
    },
  ];

  const categories = [
    "All",
    "Lifestyle",
    "Culture",
    "Creativity",
    "Wellness",
    "Travel",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero / Featured Article */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <FeaturedArticle {...featuredArticle} />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container">
          <div className="border-t border-border" />
        </div>

        {/* Articles Grid */}
        <section id="articles" className="py-12 md:py-20">
          <div className="container">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
              <div>
                <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                  Latest
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium mt-2">
                  Recent Stories
                </h2>
              </div>

              {/* Categories */}
              <div id="categories" className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-300 ${
                      index === 0
                        ? "bg-foreground text-background"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {articles.map((article, index) => (
                <div
                  key={article.title}
                  className="animate-fade-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12 md:mt-16">
              <button className="px-8 py-3.5 border border-border text-foreground font-medium rounded-sm hover:bg-secondary transition-colors duration-300">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 md:py-20 border-t border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                About
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium mt-4 mb-6">
                A space for thoughtful readers
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Inkwell is a curated collection of stories that celebrate slow
                living, deep thinking, and meaningful connections. We believe in
                the power of words to inspire change and foster understanding.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

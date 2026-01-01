interface FeaturedArticleProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

const FeaturedArticle = ({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
}: FeaturedArticleProps) => {
  return (
    <article className="group cursor-pointer">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={image}
            alt={title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        
        <div className="flex flex-col gap-4">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            {category}
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-balance group-hover:text-primary transition-colors duration-300">
            {title}
          </h2>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
            <span className="font-medium text-foreground">{author}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;

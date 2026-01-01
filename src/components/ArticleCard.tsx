interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

const ArticleCard = ({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
}: ArticleCardProps) => {
  return (
    <article className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-sm mb-4">
        <img
          src={image}
          alt={title}
          className="w-full aspect-[3/2] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          {category}
        </span>
        
        <h3 className="font-serif text-xl md:text-2xl font-medium leading-snug group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-base leading-relaxed flex-1">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-3">
          <span className="font-medium text-foreground">{author}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{readTime}</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

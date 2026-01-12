import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Mail, MessageCircle, Send, Linkedin, Facebook, Twitter, MessageSquare } from 'lucide-react';
import { copyToClipboard } from '@/utils/shareWorkout';

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  getUrl: (url: string, title: string) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-[#25D366] hover:bg-[#20BD5A] text-white',
    getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`Check out this workout plan: ${title} ${url}`)}`,
  },
  {
    name: 'X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-foreground hover:bg-foreground/90 text-background',
    getUrl: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this workout plan: ${title}`)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: 'bg-[#1877F2] hover:bg-[#166FE5] text-white',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Telegram',
    icon: <Send className="w-5 h-5" />,
    color: 'bg-[#0088CC] hover:bg-[#007AB8] text-white',
    getUrl: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out this workout plan: ${title}`)}`,
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-[#0A66C2] hover:bg-[#095BA8] text-white',
    getUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-muted hover:bg-muted/80 text-foreground',
    getUrl: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this workout plan: ${title}\n\n${url}`)}`,
  },
  {
    name: 'SMS',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-muted hover:bg-muted/80 text-foreground',
    getUrl: (url, title) => `sms:?body=${encodeURIComponent(`Check out this workout plan: ${title} ${url}`)}`,
  },
];

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareModal({ open, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlatformClick = (platform: SocialPlatform) => {
    const shareUrl = platform.getUrl(url, title);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Workout Plan</DialogTitle>
          <DialogDescription>
            Share this workout with friends on your favorite platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-3 py-4">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handlePlatformClick(platform)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${platform.color}`}
            >
              {platform.icon}
              <span className="text-xs mt-1.5 font-medium">{platform.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Input
            value={url}
            readOnly
            className="flex-1 text-sm bg-muted"
          />
          <Button
            size="sm"
            variant={copied ? 'default' : 'outline'}
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

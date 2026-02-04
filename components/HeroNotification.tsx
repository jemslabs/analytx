import { ArrowRight } from "lucide-react";

function HeroNotification() {
  return (
    <div className="absolute top-0 left-0 w-full bg-accent-foreground text-white text-center py-2 font-medium z-50 flex flex-col md:flex-row justify-center items-center gap-4">
      <span>
        🎯 Track your next creator campaign <strong>free for 15 days</strong>
      </span>
      <a
        href="/book-intro-call"
        className="underline font-semibold hover:opacity-80 flex justify-center items-center gap-1"
      >
        Book intro call <ArrowRight size={17}/>
      </a>
    </div>
  );
}

export default HeroNotification;

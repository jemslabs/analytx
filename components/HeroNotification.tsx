function HeroNotification() {
  return (
    <div className="absolute top-0 left-0 w-full bg-yellow-100 text-yellow-800 text-center py-2 font-medium z-50 flex flex-col md:flex-row justify-center items-center gap-1">
      <span>🎉 New Year Special: 30% OFF on Brand Growth Plan!</span>
      <span>
        Use code <span className="font-bold">NEWYEAR30</span>
      </span>
      <span className="text-sm md:text-base">(Limited time only)</span>
    </div>
  );
}

export default HeroNotification;

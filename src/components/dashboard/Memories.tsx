import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface Memory {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
}

interface MemoriesProps {
  memories: Memory[];
}

const Memories = ({ memories }: MemoriesProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % memories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [memories.length]);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Memories with Friends</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {memories.map((memory) => (
            <CarouselItem key={memory.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="overflow-hidden rounded-lg aspect-video relative">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-medium">{memory.title}</h3>
                    <p className="text-white/80 text-sm">{memory.date}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
};

export default Memories;
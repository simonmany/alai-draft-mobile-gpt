import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";

interface Memory {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  location: string;
  attendees: string[];
  notes: string;
}

interface MemoriesProps {
  memories: Memory[];
}

const Memories = ({ memories }: MemoriesProps) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Memories with Friends</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {memories.map((memory) => (
              <CarouselItem 
                key={memory.id} 
                className="md:basis-1/2 lg:basis-1/3 cursor-pointer"
                onClick={() => setSelectedMemory(memory)}
              >
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

      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedMemory?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Date</h4>
                <p className="text-sm text-gray-500">{selectedMemory?.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p className="text-sm text-gray-500">{selectedMemory?.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Attendees</h4>
                <p className="text-sm text-gray-500">
                  {selectedMemory?.attendees.join(", ")}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Tell Al about it</h4>
                <Textarea 
                  placeholder="Share your thoughts about this memory..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Memories;
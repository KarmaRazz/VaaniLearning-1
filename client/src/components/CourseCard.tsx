import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  image?: string;
  isComingSoon?: boolean;
}

export function CourseCard({ title, image, isComingSoon = true }: CourseCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 flex items-center justify-center">
              <div className="text-orange-600 dark:text-orange-400 text-4xl font-bold opacity-50">
                {title.charAt(0)}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={isComingSoon}
          >
            {isComingSoon ? "Coming Soon" : "View Course"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
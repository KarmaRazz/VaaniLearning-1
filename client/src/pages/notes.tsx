import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Notes() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary-orange">
              Study Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-lg">
              Access our comprehensive collection of 10,000+ study notes. 
              Browse notes by subject, topic, and difficulty level.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

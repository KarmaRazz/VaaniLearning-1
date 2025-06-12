import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary-orange">
              About Vaani
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-lg">
              Learn more about Nepal's most trusted learning platform. 
              Discover our mission, vision, and commitment to educational excellence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

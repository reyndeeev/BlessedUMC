import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Panel</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Admin functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
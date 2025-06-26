import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authApi, userApi, petApi, API_BASE_URL } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  message: string;
  data?: any;
}

const ApiTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { currentUser } = useAuth();

  const testApiConnection = async () => {
    setIsLoading(true);
    setResults([]);
    setShowResults(true);
    
    // Helper function to run a test and add to results
    const runTest = async (endpoint: string, testFn: () => Promise<any>) => {
      try {
        const data = await testFn();
        
        setResults(prev => [...prev, {
          endpoint,
          success: true,
          message: "Test passed successfully",
          data
        }]);
        
        return { success: true, data };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        
        setResults(prev => [...prev, {
          endpoint,
          success: false,
          message
        }]);
        
        return { success: false, error };
      }
    };

    try {
      // Test health endpoint
      await runTest("Backend Health", async () => {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
        return await response.json();
      });

      // Try session validation
      await runTest("Session Check", async () => {
        return await authApi.checkSession();
      });

      // If user is logged in, test more endpoints
      if (currentUser?.id) {
        // Test user profile endpoint
        await runTest("User Profile", async () => {
          return await userApi.getUserProfile(currentUser.id);
        });
        
        // Test pets endpoint
        await runTest("User Pets", async () => {
          return await petApi.getUserPets(currentUser.id);
        });
      }
      
      const successCount = results.filter(r => r.success).length;
      toast({
        title: successCount === results.length ? "All Tests Passed" : "Some Tests Failed",
        description: `${successCount}/${results.length} endpoints working correctly.`,
        variant: successCount === results.length ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : "Unknown error running tests",
        variant: "destructive",
      });
      console.error('API test error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <Button 
        onClick={testApiConnection}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="bg-transparent hover:bg-rose-50 text-burgundy border-burgundy"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing API...
          </>
        ) : (
          "Test Backend Connection"
        )}
      </Button>
      
      {showResults && results.length > 0 && (
        <div className="mt-4 space-y-3 bg-white/80 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-burgundy">Test Results</h3>
          
          {results.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg flex items-start ${
                result.success ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="mt-0.5 mr-2">
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{result.endpoint}</div>
                <div className={`text-xs ${result.success ? "text-green-700" : "text-red-700"}`}>
                  {result.message}
                </div>
                {result.success && result.data && (
                  <details className="mt-1">
                    <summary className="text-xs cursor-pointer text-gray-500 hover:text-burgundy">
                      View response data
                    </summary>
                    <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto max-h-32 text-gray-800">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTestButton;

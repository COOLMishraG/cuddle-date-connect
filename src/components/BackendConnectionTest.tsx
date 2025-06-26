import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authApi, userApi, petApi, API_BASE_URL } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// Component to test backend connectivity
const BackendConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);
  const { currentUser } = useAuth();
  
  const checkBackendConnection = async () => {
    setIsTestingConnection(true);
    setStatusMessage('Testing connection to backend...');
    
    try {
      // Try to make a simple GET request to the backend
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setConnectionSuccess(true);
        setStatusMessage('Successfully connected to backend!');
        
        if (currentUser) {
          // Test session validation if user is logged in
          try {
            const sessionData = await authApi.checkSession();
            if (sessionData) {
              setStatusMessage(prev => `${prev}\n✅ User session is valid.`);
            }
          } catch (error) {
            setStatusMessage(prev => `${prev}\n❌ Session validation failed.`);
          }
        }
      } else {
        const errorText = await response.text();
        setConnectionSuccess(false);
        setStatusMessage(`Failed to connect to backend. Status ${response.status}: ${errorText}`);
      }
    } catch (error) {
      setConnectionSuccess(false);
      setStatusMessage(`Could not connect to backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="p-4 mt-4 bg-white/90">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Backend Connection Test</h3>
        
        <div className="mb-4">
          <p>API URL: {API_BASE_URL}</p>
          
          {statusMessage && (
            <div className={`mt-2 p-3 rounded ${connectionSuccess 
              ? 'bg-green-50 text-green-800' 
              : connectionSuccess === false 
                ? 'bg-red-50 text-red-800' 
                : 'bg-blue-50 text-blue-800'
            }`}>
              {statusMessage.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          onClick={checkBackendConnection}
          disabled={isTestingConnection}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : connectionSuccess === null ? (
            'Test Backend Connection'
          ) : connectionSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Test Again
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Retry Connection
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default BackendConnectionTest;

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AlertType = 'default' | 'destructive';

interface AlertState {
    title: string;
    description: string;
    type: AlertType;
}

const DomainChecker = () => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [alert, setAlert] = useState<AlertState | null>(null);

    const showAlert = (title: string, description: string, type: AlertType = 'default') => {
        setAlert({ title, description, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const checkDomain = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!domain) {
            showAlert('Error', 'Please enter a domain name', 'destructive');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/check-domain/${domain}`);

            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check the content type
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server");
            }

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                showAlert('Success', 'Domain check completed successfully');
            } else {
                throw new Error(data.error || 'Failed to check domain');
            }
        } catch (error) {
            let errorMessage = 'An error occurred while checking the domain';

            if (error instanceof Error) {
                // If it's a known error type, use its message
                errorMessage = error.message;
            }

            // Check if it might be a network error
            if (!navigator.onLine) {
                errorMessage = 'Please check your internet connection';
            }

            showAlert('Error', errorMessage, 'destructive');
            setResult(null); // Clear any previous results
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {alert && (
                <div className="fixed top-4 right-4 z-50 w-72 animate-in slide-in-from-top">
                    <Alert variant={alert.type}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                    </Alert>
                </div>
            )}

            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Domain Availability Checker
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={checkDomain} className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="Enter domain name (e.g., example.com)"
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    "Checking..."
                                ) : (
                                    <>
                                        <Search className="w-4 h-4 mr-2" />
                                        Check
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {result && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Results:</h3>
                            <div className="space-y-2">
                                {Object.entries(result).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="font-medium">{key}:</span>
                                        <span>{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export { DomainChecker };
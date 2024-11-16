import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DomainChecker } from '@/components/DomainChecker';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<DomainChecker />} />
                </Routes>
                <Toaster />
            </div>
        </Router>
    );
};

export default App;
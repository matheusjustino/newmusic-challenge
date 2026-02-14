import { Loader } from 'lucide-react';
import { NextPage } from 'next';

const LoadingPage: NextPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader className="animate-spin w-10 h-10" />
        </div>
    );
};

export default LoadingPage;

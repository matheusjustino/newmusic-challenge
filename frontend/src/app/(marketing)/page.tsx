import { NextPage } from 'next';

const MarketingHomePage: NextPage = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-8 px-3 py-2 pt-32">
            <h1 className="font-semibold text-5xl">Welcome back, visitor!</h1>

            <h2 className="text-2xl text-muted-foreground">
                This is the <b className="underline text-[#027DC8]">NewMusic</b>{' '}
                challenge.
            </h2>
        </div>
    );
};

export default MarketingHomePage;

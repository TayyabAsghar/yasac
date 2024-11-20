import Link from 'next/link';
import { Laptop, TabletSmartphone } from 'lucide-react';

const LoginButton = () => (
    <Link
        href="/sign-in"
        title="Login"
        className="left-sider-link w-fit flex items-center h-10 px-4 py-0 bg-primary-500 hover:bg-secondary-500"
    >
        <Laptop className="text-light-1 max-md:hidden" aria-hidden="true" />
        <TabletSmartphone className="text-light-1 hidden max-md:block" aria-hidden="true" />
        <p className="text-light-1 font-medium max-md:hidden max-sm:block max-[404px]:hidden">
            Log in to Connect
        </p>
    </Link>
);

export default LoginButton;
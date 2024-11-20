import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import { useAuth, useOrganization, useSignIn } from '@clerk/nextjs';
import { SiderLinks, SiderLinksType } from '@/core/constants/navigation-links';

type DynamicLinksType = SiderLinksType & { isActive: boolean; };

export const useDynamicLinks = () => {
    const { userId } = useAuth();
    const pathname = usePathname();
    const isLoadedSignIn = useSignIn().isLoaded;
    const { organization, isLoaded: isOrgLoaded } = useOrganization();

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [dynamicLinks, setDynamicLinks] = useState<DynamicLinksType[]>([]);

    useEffect(() => {
        const fetchUserName = async () => {
            if (userId) {
                const userInfo = await fetchUser(userId);
                setUsername(userInfo.username);
            }
        };
        fetchUserName();
    }, [userId]);

    useEffect(() => {
        if (!isOrgLoaded || !isLoadedSignIn) {
            setLoading(true);
            return;
        }

        const updatedLinks: DynamicLinksType[] = SiderLinks.map(link => {
            const route =
                link.route === '/profile'
                    ? organization
                        ? `/communities/${organization.slug}`
                        : username
                            ? `${link.route}/${username}`
                            : link.route
                    : link.route;

            const isThreadRoute = link.route === '/home' && pathname.includes("/thread/");
            const isUserOrgPath = organization?.slug && pathname === `/communities/${organization.slug}`;
            const isActive = (route === pathname || (!isUserOrgPath && pathname.includes(route)) || isThreadRoute);

            return { ...link, route, isActive };
        });

        setDynamicLinks(updatedLinks);
        setLoading(false);
    }, [isOrgLoaded, isLoadedSignIn, username, organization, pathname]);

    return { dynamicLinks, loading };
};

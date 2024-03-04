
import { headers } from 'next/headers';
import { IncomingHttpHeaders } from 'http';
import { NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { CommunityData } from '@/core/types/community-data';
import { addMemberToCommunity, createCommunity, deleteCommunity, removeUserFromCommunity, updateCommunityInfo } from '@/lib/actions/community.actions';

export const POST = async (req: Request) => {
    const NEXT_CLERK_WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

    if (!NEXT_CLERK_WEBHOOK_SECRET)
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');

    const header = headers();

    const heads = {
        'svix-id': header.get('svix-id') || '',
        'svix-timestamp': header.get('svix-timestamp') || '',
        'svix-signature': header.get('svix-signature') || '',
    };

    if (!heads['svix-id'] || !heads['svix-timestamp'] || !heads['svix-signature'])
        return NextResponse.json({ message: 'Error occurred -- no svix headers' }, { status: 400 });

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const webhook = new Webhook(NEXT_CLERK_WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
        event = webhook.verify(body, heads as IncomingHttpHeaders & WebhookRequiredHeaders) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return NextResponse.json({ message: err }, { status: 400 });
    }

    switch (event?.type) {
        // Organization
        case 'organization.created':
            try {
                const { id, name, slug, image_url, created_by } = event?.data ?? {};
                const communityData: CommunityData = {
                    id: id,
                    name: name,
                    slug: slug || '',
                    image: image_url,
                    bio: '',
                    createdById: created_by
                };

                await createCommunity(communityData);
                return NextResponse.json({ message: 'Organization created' }, { status: 201 });
            } catch (err: any) {
                console.error(err);
                if (err.statusCode === 404)
                    return NextResponse.json({ message: err.message }, { status: err.statusCode });
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        case 'organization.deleted':
            try {
                await deleteCommunity(event?.data?.id || '');
                return NextResponse.json({ message: 'Organization deleted' }, { status: 201 });
            } catch (err: any) {
                console.error(err);
                if (err.statusCode === 404)
                    return NextResponse.json({ message: err.message }, { status: err.statusCode });
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        case 'organization.updated':
            try {
                const { id, image_url, name, slug } = event?.data;
                await updateCommunityInfo(id, name, slug || '', image_url);
                return NextResponse.json({ message: 'Member removed' }, { status: 201 });
            } catch (err: any) {
                console.error(err);
                if (err.statusCode === 404)
                    return NextResponse.json({ message: err.message }, { status: err.statusCode });
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        // Organization Membership
        case 'organizationMembership.created':
            try {
                const { organization, public_user_data } = event?.data;
                await addMemberToCommunity(organization.id, public_user_data.identifier);
                return NextResponse.json({ message: 'Invitation accepted' }, { status: 201 });
            } catch (err: any) {
                console.error(err);
                if (err.statusCode === 409)
                    return NextResponse.json({ message: err.message }, { status: err.statusCode });
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        case 'organizationMembership.deleted':
            try {
                const { organization, public_user_data } = event?.data;
                await removeUserFromCommunity(public_user_data.user_id, organization.id);
                return NextResponse.json({ message: 'Member removed' }, { status: 201 });
            } catch (err: any) {
                console.error(err);
                if (err.statusCode === 404)
                    return NextResponse.json({ message: err.message }, { status: err.statusCode });
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
    }
};

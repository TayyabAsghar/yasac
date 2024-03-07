'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';

interface Props {
    threadId: string;
    currentUserId: string;
    authorId: string;
}

const DeleteThread = ({ threadId, currentUserId, authorId }: Props) => {
    const pathname = usePathname();

    const handleDeleteThread = async () => {
        await deleteThread(threadId, pathname);
    };

    if (currentUserId !== authorId || pathname === '/home') return null;

    return (
        <Image src='/assets/delete.svg' alt='Delete' title='Delete' width={18} height={18}
            className='cursor-pointer object-contain'
            onClick={async () => await handleDeleteThread()} />
    );
};

export default DeleteThread;

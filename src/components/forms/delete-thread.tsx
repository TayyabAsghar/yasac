'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

    if (currentUserId !== authorId || pathname === '/home' || pathname.includes('/thread')) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Image src='/assets/delete.svg' alt='Delete' title='Delete' width={18} height={18}
                    className='cursor-pointer object-contain' />
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-dark-2 border-dark-1'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-white'>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your thread
                        and all the comments associated with it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-500 hover:bg-red-700'
                        onClick={async () => await handleDeleteThread()} >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteThread;

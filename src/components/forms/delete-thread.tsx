'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
    threadId: string;
    currentUserId: string;
    authorId: string;
}

const DeleteThread = ({ threadId, currentUserId, authorId }: Props) => {
    const pathname = usePathname();
    const canDelete = currentUserId === authorId && pathname !== '/home' && !pathname.includes('/thread');

    if (!canDelete) return null;

    const handleDeleteThread = async () => {
        try {
            await deleteThread(threadId, pathname);
        } catch (error) {
            console.error("Failed to delete thread:", error);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Image
                    className='cursor-pointer object-contain' src='/assets/delete.svg'
                    aria-label='Delete Thread' alt='Delete Thread' title='Delete Thread'
                    width={18} height={18}
                />
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-dark-2 border-dark-1' aria-labelledby="delete-thread-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle id="delete-thread-dialog-title" className='text-white'>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription id="delete-thread-dialog-description">
                        This action cannot be undone. This will permanently delete your thread
                        and all the comments associated with it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-red-500 hover:bg-red-700'
                        onClick={handleDeleteThread}
                    >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteThread;

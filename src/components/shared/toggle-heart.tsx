'use client';

import Image from 'next/image';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { likeThread, removeLike } from '@/lib/actions/thread.actions';

type Props = {
    userId: string;
    threadId: string;
    likesCount: number;
    isLiked: boolean;
};

export default function ToggleHeart(props: Props) {
    const { toast } = useToast();
    const [state, setState] = useState({ isLiked: props.isLiked, likesCount: props.likesCount });

    const toggleLike = async () => {
        try {
            if (!state.isLiked) {
                setState({ isLiked: !state.isLiked, likesCount: state.likesCount + 1 });
                await likeThread(props.threadId, props.userId);
            } else {
                setState({ isLiked: !state.isLiked, likesCount: state.likesCount - 1 });
                await removeLike(props.threadId, props.userId);
            }
        } catch {
            toast({
                variant: 'destructive',
                description: 'There was an error liking the Thread.'
            });
            setState({ isLiked: state.isLiked, likesCount: state.likesCount + (state.isLiked ? 1 : -1) });
        }
    };

    return (
        <>
            <div onClick={async () => await toggleLike()} className='flex gap-1'>
                {state.isLiked ?
                    <Image src='/assets/heart-filled.svg' alt='Like' title='Like' width={24} height={24}
                        className='cursor-pointer object-contain' />
                    :
                    <Image src='/assets/heart-gray.svg' alt='Like' title='Like' width={24} height={24}
                        className='cursor-pointer object-contain' />
                }
                {state.likesCount > 0 && (
                    <span className='text-gray-1'>{formatNumber(state.likesCount)}</span>
                )}
            </div>
        </>
    );
}

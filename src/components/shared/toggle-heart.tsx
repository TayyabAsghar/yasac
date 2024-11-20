'use client';

import Image from 'next/image';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { likeThread, removeLike } from '@/lib/actions/thread.actions';

type Props = {
    userId: string;
    threadId: string;
    isLiked: boolean;
    likesCount: number;
};

const ToggleHeart = ({ userId, threadId, likesCount, isLiked }: Props) => {
    const { toast } = useToast();
    const [state, setState] = useState({ isLiked, likesCount });

    const handleToggleLike = async () => {
        const prevState = { ...state };

        try {
            if (!state.isLiked) {
                setState(prev => ({ isLiked: true, likesCount: prev.likesCount + 1 }));
                await likeThread(threadId, userId);
            } else {
                setState(prev => ({ isLiked: false, likesCount: prev.likesCount - 1 }));
                await removeLike(threadId, userId);
            }
        } catch (error) {
            setState(prevState);
            toast({
                variant: 'destructive',
                description: 'There was an error liking the Thread.',
            });
        }
    };

    return (
        <div onClick={handleToggleLike} className="flex gap-1 cursor-pointer">
            <Image
                src={state.isLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
                alt={state.isLiked ? 'Unlike' : 'Like'}
                title={state.isLiked ? 'Unlike' : 'Like'}
                width={24} height={24}
                className="object-contain"
            />
            {state.likesCount > 0 && (
                <span className="text-gray-1">{formatNumber(state.likesCount)}</span>
            )}
        </div>
    );
};

export default ToggleHeart;

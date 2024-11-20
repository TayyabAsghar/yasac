import { formatNumber } from '@/lib/utils';

type ProfileStatsProps = {
    stats: {
        count: number;
        label: string;
    }[];
};

const ProfileStats = ({ stats }: ProfileStatsProps) => (
    <div className="flex items-center gap-10 max-sm:gap-3">
        {stats.map((stat, index) => (
            <div key={index} className="text-light-2 text-center">
                <div className="text-heading3-bold">{formatNumber(stat.count)}</div>
                <div className="text-body-medium">{stat.label}</div>
            </div>
        ))}
    </div>
);

export default ProfileStats;

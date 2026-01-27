import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ItemSkeleton({ view = 'grid' }: { view: 'grid' | 'list' }) {
    if (view === 'list') {
        return (
            <div className="flex items-center p-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="ml-4 flex-grow space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full aspect-video" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-1/4" />
            </CardFooter>
        </Card>
    );
}

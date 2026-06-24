import { Badge } from "@/components/ui/badge"
import { PostStatus } from "@/types"

interface PostStatusBadgeProps {
  status: PostStatus
}

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-[#4a8a5b] hover:bg-[#4a8a5b]/80">Published</Badge>
    case 'DRAFT':
      return <Badge className="bg-[#a87f17] hover:bg-[#a87f17]/80">Draft</Badge>
    case 'SCHEDULED':
      return <Badge className="bg-primary hover:bg-primary/80">Scheduled</Badge>
    case 'ARCHIVED':
      return <Badge variant="secondary">Archived</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

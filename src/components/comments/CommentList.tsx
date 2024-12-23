import { WordPressComment } from '@/types/wordpress';

interface CommentListProps {
  comments: WordPressComment[];
}

function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Comments ({comments.length})</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{comment.author_name}</h3>
              <time className="text-sm text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </time>
            </div>
          </div>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}

export default CommentList; 
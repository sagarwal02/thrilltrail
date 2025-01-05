import { NextRequest, NextResponse } from 'next/server';

interface RedditChild {
  kind: string;
  data: {
    body?: string;
    author?: string;
    id?: string;
    parent_id?: string;
    count?: number;
    children?: string[];
  };
}

const extractComments = (child: RedditChild, comments: string[], more: string[][]) => {
  switch (child.kind) {
    case "t1":
      if (child.data.body && child.data.author && child.data.id && child.data.parent_id) {
        comments.push(child.data.body);
      }
      break;
    case "more":
      if (child.data.count && child.data.count > 0 && child.data.children) {
        more.push(child.data.children);
      }
      break;
  }
};

const getPostComments = async (postId: string) => {

  const res = await fetch("https://www.reddit.com/comments/" + postId + ".json");
  console.log(res);
  const comments : string[] = [];
  const more: string[][] = [];



//   res[1].data.children.forEach((child: RedditChild) => {
//     extractComments(child, comments, more);
//   });

  return [ comments, more ];
};


export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId');
  console.log(postId)

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const comments = await getPostComments(postId);
    return comments[0];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}


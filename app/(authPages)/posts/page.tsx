import { useRouter } from "next/navigation";
import { readPosts } from "./actions";
import { PostsContent } from "./content";

export default async function PostsPage() {
  const posts = await readPosts();

  return <PostsContent posts={posts} />;
}

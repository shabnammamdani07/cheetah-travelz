import { createFileRoute } from "@tanstack/react-router";

import { getPost } from "@/home/blog";
import { pageHead } from "@/home/head";
import { BlogPostPage } from "@/home/pages";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const p = getPost(params.slug);
    return p
      ? pageHead(p.title, p.excerpt)
      : pageHead("Guide not found", "This guide isn't available.", { noindex: true });
  },
  component: function BlogRoute() {
    const { slug } = Route.useParams();
    return <BlogPostPage slug={slug} />;
  },
});

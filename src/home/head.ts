import homeCss from "./home.css?url";

/* Shared <head> for public pages: title, description and the site stylesheet. */
export function pageHead(title: string, description: string, opts: { noindex?: boolean } = {}) {
  return {
    meta: [
      { title: `${title} | Cheetah Travelz` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Cheetah Travelz` },
      { property: "og:description", content: description },
      ...(opts.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "stylesheet", href: homeCss }],
  };
}

---
layout: "../../layouts/MarkdownPost.astro"
title: "Creating dynamic enum type using readonly list"
pubDate: 2023-03-08
description: "In this post you'll know how to infer enum types from readonly list to keep the single source of truth"
author: "wvovaw"
image:
  url: "/blog/posts/dynamic_enums_ts/banner.png"
  alt: "Typescript code"
tags: ["typescript"]
---

Let"s say we have a union type that is responsible for the publishing state of article.

```typescript:types.ts
export interface Article {
  title: string;
  state: ArticleState;
}

export type ArticleState = "draft" | "published";
```

What if you need to add a new option like "on-review"? You must open the `types.ts` file, find this type and add a new option.

But there is a good practice to take this options out in a separate **readonly tuple** and use its type:

```typescript:constants.ts
export const articleState = ["draft", "published", "on-review"] as const;
```

```typescript:types.ts
import type { articleState } from "@/constants";

export interface Article {
  title: string;
  state: ArticleState;
}

export type ArticleState = (typeof articleState)[number];
```

This approach makes types more flexible and easier to maintain the app.

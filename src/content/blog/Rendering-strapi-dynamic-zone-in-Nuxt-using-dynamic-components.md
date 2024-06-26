---
title: "Rendering Strapi dynamic zones in Nuxt"
publishDate: 2023-03-02
description: "How to make your Nuxt frontend to render strapi dynamic zones"
author: "wvovaw"
image:
  src: "/blog/images/posts/strapi-nuxt-dynamic-zones/banner.png"
  alt: "Strapi and Nuxt"
  width: 1050
  height: 600
tags: ["strapi", "nuxt"]
---

Creating a dynamic zone on a page is the best solution for those clients who obviously won't be tinkering on the nuxt frontend code base by themselves, but edit a website content in the strapi content manager. Clients may want to move one block on above of another, add or remove some parts of a web page, so they usually ask a web developer to do it. It may cost much time for the developer of the project to make this type of changes and cost client money. Adding strapi dynamic zones saves time and money.

# Prerequisites

1. Strapi application with pages collection type
2. Nuxt frontend application with `[page].vue` page component (route)

# In Strapi

In this example we have page collection in Strapi. Nuxt has `[pages].vue` page that renders particular page depending on its slug defined in Strapi. We will be adding the dynamic zone named Blocks and a couple of example components that will be available in the Blocks dynamic zone. It is possible to define different dynamic zones and delimit components which may be added in each zone.

## Create blocks examples

Create new components (_I recommend to place components under the category which has the same name as the dynamic zone it will be available as an option_)

Let's create a **Hero** component. It will display the title and smaller subtitle and It will also have text size and alignment dependent on its selections

![create hero component in strapi](/blog/images/posts/strapi-nuxt-dynamic-zones/create-hero-component-in-strapi.png)

And another component - **RichText** which will only have one field with the Rich text type

![create rich text component in strapi](/blog/images/posts/strapi-nuxt-dynamic-zones/create-rich-text-component-in-strapi.png)

## Add Blocks dynamic zone

After we have created a couple of blocks we must add dynamic zone on the page and for consistency name it Blocks

![add dynamic zone on page](/blog/images/posts/strapi-nuxt-dynamic-zones/add-dynamic-zone-on-page.png)
![add dynamic zone on page result](/blog/images/posts/strapi-nuxt-dynamic-zones/add-dynamic-zone-on-page-result.png)

After that save the changes, create an example page and add this blocks on it

![test page view](/blog/images/posts/strapi-nuxt-dynamic-zones/test-page-view.png)

Save it and publish and we're ready to go further.

# In Nuxt

> [!warning]
> Class attributes with styles have been omitted as they are not relevant to the article.

To display our components on a page we must have created `Hero.vue` and `RichText.vue` components and the `BlocksDynamicZone.vue` component which will dynamically resolve which of them to render depending on strapi data.

Directory structure:

```
├── components
│   └── strapi_components
│       └── blocks
│          ├── Hero.vue
│          ├── RichText.vue
│          └── BlocksDynamicZone.vue
```

> [!tip] Recommendatoin
> I recommend to create **strapi_components** directory in the `@/components` directory to place all the strapi dependent components there to keep your app code consistent and easier to maintain. In this example we add **blocks** directory in the **strapi_components** and place our `Hero.vue` and `RichText.vue` in it.

## Create BlocksDynamicZone.vue component

```vue:@/components/strapi_components/blocks/BlocksDynamicZone.vue
<script lang="ts" setup>
defineProps({
  blocks: {
    type: Object,
    required: true,
  },
});
const components = new Map([
  ["blocks.hero", resolveComponent("Hero")],
  ["blocks.rich-text", resolveComponent("RichText")],
]);
</script>

<template>
  <template v-for="block of blocks" :key="block.id">
    <component :is="components.get(block.__component)" :block="block" />
  </template>
</template>
```

The `BlocksDynamicZone.vue` responses for deciding which component to render depending on the data from the strapi backend. All we need to implement this behavior is to pass the **blocks** array of the **page** object as a component property, then iterate over all the elements in the **blocks** array and use its `__component` property as the key to get corresponding component. This approach uses [Vue dynamic components](https://nuxt.com/docs/guide/directory-structure/components#dynamic-components) mechanism with `resolveComponent()` helper function provided by vue. Map fits very well here because we have a key-value dependency.

> [!info] Case transforms
>
> Remember that strapi translates _PascalCase_ and _camelCase_ names to _kebab-case_. So, _RichText_ becomes _rich-text_ etc.

## Create blocks components

```vue:@/components/strapi_components/blocks/Hero.vue
<script lang="ts" setup>
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section>
    <div
      class="some-styles"
      :class="{
        'md:text-start': block.align === 'left',
        'md:text-center': block.align === 'center',
        'md:text-end': block.align === 'right',
      }"
    >
      <p
        class="some-styles"
        :class="{
          'text-4xl': block.size === 'large',
          'text-3xl': block.size === 'medium',
          'text-2xl': block.size === 'normal',
          'text-xl': block.size === 'small',
        }"
      >
        {{ block.title }}
      </p>
      <p
        class="some-styles"
        :class="{
          'text-xl': block.size === 'large',
          'text-lg': block.size === 'medium',
          'text-base': block.size === 'normal',
          'text-sm': block.size === 'small',
        }"
      >
        {{ block.subtitle }}
      </p>
    </div>
  </section>
</template>
```

```vue:@/components/strapi_components/blocks/RichText.vue
<script lang="ts" setup>
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="prose"
    v-html="$mdRenderer.render(block.content)"
  />
</template>
```

`Hero.vue` and `RichText.vue` components accepts one property - blocks. It makes it possible to unify the interface of the dynamic component:

```vue
<component :is="block.__component" :block="block" />
```

**Pros:**

- Less code
- Easy to add new components
- Unified interface (single property)

**Cons:**

- No separate props checking and validation (but you can still make validators for the block property and validate its fields)

## Add BlocksDynamicZone.vue on the page

```vue:@/pages/[page].vue
<script lang="ts" setup>
const route = useRoute().path.replace("/", "");
const page = await(await usePages({ slug: { $eq: route } })).pages;
</script>

<template>
  <BlocksDynamicZone :blocks="page.data[0].attributes.Blocks" />
</template>
```

```ts:@/composables/pages.ts
export async function usePages(filters: Record<string, any>) {
  const { find } = useStrapi();
  const data = await useAsyncData("pages", () =>
    find("pages", {
      publicationState: "preview",
      populate: {
        Blocks: {
          on: {
            "blocks.rich-text": {
              populate: "*",
            },
            "blocks.hero": {
              populate: "*",
            },
          },
        },
      },
      fields: ["title", "slug"],
      filters,
    }));

  return { pages: toRaw(data.data.value) };
}
```

Since strapi does not include dynamic zones in response by default you must populate it. Don't forget to add each new component to the request schema as above.

# Result

![result](/blog/images/posts/strapi-nuxt-dynamic-zones/result.png)

# Conclusion

This approach makes possible to edit a page blocks placement and rearrange blocks right in the strapi content manager. You can query the blocks structure on every page visit, cache it with some ttl, or fire a build process to build a page statically. It also possible to create different dynamic zones for different needs, like form builders, dynamic menus etc.

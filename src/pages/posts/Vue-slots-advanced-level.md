---
layout: "../../layouts/MarkdownPost.astro"
title: "Advanced usage of slots in Vue 3"
pubDate: 2023-03-03
description: "Vue slots must know features like named scoped slots and renderless components"
author: "wvovaw"
image:
  src: "/blog/posts/advanced-vue-slots/banner.png"
  alt: "vue slots"
  width: 1050
  height: 600
tags: ["vue"]
---

Slots is one of the most used features in vue. We get used to use **Default Slots** and [**Named Slots**](https://vuejs.org/guide/components/slots.html#named-slots) to pass html template in components. But slots also has **two** great features - [**Dynamic Slot Names**](https://vuejs.org/guide/components/slots.html#dynamic-slot-names) and [**Scoped Slots**](https://vuejs.org/guide/components/slots.html#scoped-slots). That is all this article is about.

# Dynamic Slot Names

[Official vue documentation](https://vuejs.org/guide/components/slots.html#named-slots) says:

> [!quote] Vue docs
> [Dynamic directive arguments](https://vuejs.org/guide/essentials/template-syntax.html#directives) also work on `v-slot`, allowing the definition of dynamic slot names:

```vue
<base-layout>
	<template v-slot:[dynamicSlotName]>
	     ...
	</template>
	
	<!-- with shorthand -->
	<template #[dynamicSlotName]>
	    ...
	</template>
</base-layout>
```

I found it not that clear and obvious as it supposed to be. So here is a neat example of a use case of this approach:
Here we have a simple `VArticle.vue` component that has 3 named slots - `title`, `description`, `text` to render an article in the correct order and applies the default html styles:

```vue:VArticle.vue
<template>
  <h1>
    <slot name="title" />
  </h1>
  <h4>
    <slot name="description" />
  </h4>
  <p>
    <slot name="text" />
  </p>
</template>
```

And in the parent component we won't declare `VArticle.vue` slots explicitly, but create an object with properties representing slots names where the value will be passed and use `v-for` and [Dynamic directive arguments](https://vuejs.org/guide/essentials/template-syntax.html#directives) to resolve the slot:

```vue:App.vue
<script setup>
import VArticle from "./VArticle.vue";
const article = {
  title: "Vue slots: advanced level",
  description: "This article is about how to use vue slots",
  text: "lorem ipsum dolor...",
};
</script>

<template>
  <VArticle>
    <template v-for="(val, key) of article" :key="key" #[key]>
      {{ val }}
    </template>
  </VArticle>
</template>
```

Result:

![slots result example 1](/blog/posts/advanced-vue-slots/advanced-vue-slots-1.png)

Check it on [The Vue SFC Playground](https://sfc.vuejs.org/#eNp9Uk1PwzAM/StWOADSlgiJUzWQ+AccEBfCobQeKzQfStwCmvbfsRNA20D0UPnFzy/xs7fqJkY9T6gatcpdGiJBRpritfWDiyER3N+GTLBOwcGpNgVJwan1XfCciZK+gq31lmigERuw6n5CyGOg3EDbz63vsIcRZxytWgixx3rZELzQ7zZDhjbR0I0IEj6FiWAT3oACTBmBL6x6X/WE7ySFY0joYIh5ctAHRlprq6zfWb8y9QruhAGhi2NLKIhWpYsSMvhOVWhpXq5DurLqbG7HBbzixzmEdWlTlCun4WOm8F/OoHwnDwwfK4O1oTK3W2Ad2PGLhLQyhy+phnK8l1ALVb1fujbqlxw8T4f9BW64JtiGRhwXRavYHMFWbYhibozJ605G9JJ1SM+GI50mT4NDjdktn1J4y5hYuJj5o2H4cMa0TOh7TJj+0zyi/tIVWe54x638bIys2F7z7MXm4nsGMlvwrUM2tSyRVWCuy9OEaApTKi7/qtjbpuM64XMg+1zsP7iIl6jwK1c4+1PYfQLryRFj)

# Scoped Slots

## Principe

Scoped slots is the mechanism of passing child components data up to the ~~parent component~~ template that will be rendered in the place of the slot. To do this `<slot />` default component may accept attributes just like components accept props:

![slots diagram](/blog/posts/advanced-vue-slots/slots-diagram.png)

## Scoped Slots example

```vue:App.vue
<script setup>
import MyComponent from "./MyComponent.vue";
</script>

<template>
  <MyComponent v-slot="slotProps">
    {{ slotProps.text }} {{ slotProps.count }}
  </MyComponent>
</template>
```

```vue:MyComponent.vue
<script setup>
const greetingMessage = "Hello World!";
</script>

<template>
  <div>
    <slot :text="greetingMessage" :count="1"></slot>
  </div>
</template>
```

`v-slot` directive makes the slot attributes available on the template. But usually `v-slot` used in pair with JS object destructuring like here:

```vue
<!-- Using destructuring -->
<template>
  <MyComponent v-slot="{ text, count }"> {{ text }} {{ count }} </MyComponent>
</template>
```

This is the most basic example of the scoped slots.

## Named Scoped Slots example

It may be also used in pair with the **Named Slots**:

```vue:App.vue
<script setup>
import MyComponent from "./MyComponent.vue";
</script>

<template>
  <MyComponent>
    <template #default="{ text, count }">
      <p>default slot: {{ text }} {{ count }}</p>
    </template>
    <template #date="{ date }">
      <p>date slot: {{ date }}</p>
    </template>
    <template #article="{ title, text, views }">
      <h1>{{ title }}</h1>
      <p>{{ text }}</p>
      <span>{{ views }} views</span>
    </template>
  </MyComponent>
</template>
```

```vue:MyComponent.vue
<script setup>
const greetingMessage = "Hello World!";
const dateString = Date.now();
const someObject = { title: "Title", text: "Lorem ipsum...", views: 12 };
</script>

<template>
  <div>
    <slot :text="greetingMessage" :count="1"></slot>
    <slot name="date" :date="dateString"></slot>
    <slot name="article" v-bind="someObject"></slot>
  </div>
</template>
```

> [!warning] Warning
> Slots _name_ attribute won't be included in the props because it is reserved

> [!warning] Warning
> If you are mixing named slots with the default scoped slot, you need to use an explicit `<template>` tag for the default slot as in above. Attempting to place the `v-slot` directive directly on the component will result in a compilation error.

Check it on [The Vue SFC Playground](https://sfc.vuejs.org/#eNp9U8Fu2zAM/RVOO3QDEhvZ0XMDDNthhxU7bMAuujg2kzqwJUGinRWB/72krdZOWiSHgCIfH/3Ep7P65lzSd6gylYfS144gIHVuq03dOusJHp6+W44MGoK9ty3cJekiJ8132uTp1M19fCBsXVMQyonyBXpMcOoFAB8r3BddQ/danYHwP62gtB2PGrSKYIDcbSHiIDSWMjhPYBgGCWPHAHkqHz5OSC++4XIk/4/zJIiDYPyNgyT5OmWCzMyMucFceKrLZiKnmhpcRU19jaew0MRdj5utqBDUNIATr0U31qLCWRVXgiuMFCPjMAV8/ZJ/V3u+XBdnFmW1UtOW123hkmOwhn1wltvQsRC04nuY7kcr3rWctXokciFL07AvxQDHkFh/SDlKPK+ibjHB0K533p4CeibWarXgSDnZo197NBV69Lc4r6BveIV20GZgKVeufMfSmkprAsHBI1JtDg8YQnFAuOfxP7FpLPyzvqk+aPV1BosF/pBnOON+8CEx9vTp8wIRbIu/d0csiRFxp6LorwQsfdykJH5Zjy3ULnRtkiRSGbeXweYLDEx46xVVdf+yX3EnZELKTrvSohVk43vg0ob9xpSMvug0RSsWFV2Cjs9hlnmzK1qcG/v1rjYVp2b5l515On3z0nDDM71FkY0=)

## Renderless Components

Using **Scoped Slots** we can make components that only encapsulate logic and do not render anything by themselves - visual output is fully delegated to the consumer component. This example represents **Renderless Disclosure.vue** component which only handles the _show / hide_ state and the _toggle_ method. The show flag and the toggle method is passed as slot props.

> [!info] Info
> This approach is used in component libraries like [HeadlessUI](https://headlessui.com/vue/disclosure#using-slots)

```vue:App.vue
<script setup>
import Disclosure from "./Disclosure.vue";
const text =
  "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.";
</script>

<template>
  <Disclosure v-slot="{ show, toggle }">
    <div class="disclosure">
      <div role="button" class="btn" @click="toggle">
        {{ show ? "Show" : "Hide" }}
      </div>
      <p :class="{ collapse: show }">
        {{ text }}
      </p>
    </div>
  </Disclosure>
</template>

<style scoped>
.disclosure {
  background-color: pink;
  border: 4px double black;
  padding: 10px;
}
.btn {
  width: 100%;
  cursor: pointer;
}
.collapse {
  display: none;
}
</style>
```

```vue:Disclosure.vue
<script setup>
import { ref } from "vue";
const show = ref(true);
const toggle = () => {
  show.value = !show.value;
};
</script>

<template>
  <slot :show="show" :toggle="toggle" />
</template>
```

The `DIsclosure.vue` component delegates all the visual output to the consumer component via scoped slots so no rendering in it.

Check it on [The Vue SFC Playground](https://sfc.vuejs.org/#eNp9U8lu2zAQ/ZUpgcIJEEsp0JNqpwt6aM698iJRY5sxRRLkyAsM/3uHlBSr6aKLyJl5bxbOu4iv3heHHkUlVlEF7QkiUu+fpNWdd4Hgu47KuNgHhE1wHSyK8mZK0IW0ytlIQHgiWIMU33qCZ+h6tuHJm1pbIAdn18POHaE2BminI3Q6Ur1HC7rFGtwGWrSut0rbLXiDdc5Z2xZ8qHXM1kR1rCM0LtjseoajZr6tPmBOUINyHYOJkUoxGyVi2iHEcyTsCimkXZVDq9wkX9jKNRKmG61m7R6W0ThaS3GByIU/cBPbrUG4SpFjObrVB1CmjpGj2ldk9gN/Y0RwBjmg6YmcleIV0VC6fVFGqz1fB/oZWNJlSA2feao/+cDhFR9/8MT4eL2+pik5zy2ph2rKcYGFcsbUPuKiGsiG+lNoCuYU+eHmZOn503miTbbbYNiwKudTs6tIZx5MVM5jm7HFbRpwGciaWu23gZ+kXXJFLlTgtd1/Sk5J/KAtsumjP0Hr+obZGsOA7AZ++LblBajgw6M/ZVuutuAJTvRH3dIuBTy+H0GqDzGncdoShhlsmsiAlcTFcjPnCqyzOMXxlqSunsSDGKSw7GpfvERnWSwDcHREKaqpDClYEukuxY7Ix6os40YlnbzEwoVtyaci8F7qDguM3bIJ7hgxMLEUDzOOko0HDMuAlieD4X+cb0L/4B07unIrv2v3L7IHGIV/gYAbuA6qH9vKsxnUnldpnWLuKPR4P3ONOlnD3T2sn6bJJEBxqE2fPO9ut9m8/6VK3r8kRagSipc6/ZIUhkQz6ZRvd1NcfwH9pqz6)

# Conclusion

The main advantage of the **Dynamic Slot Names** is just that you have this syntax so in some cases it may make your code cleaner and readable.

**Scoped Slots** and **Scoped Named Slots** gives a good mechanism to pass data from the **slot** up to the template where you can use it to build more complex slot rendering logic as in the [**Renderless Components**](#Renderless%20Components).

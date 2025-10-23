<script setup lang="ts">

import {version} from '~/../package.json';

const route = useRoute();

const appVersion = `v${version}`;
const copyrightDate = "2025";

const expandedIconName = "ic:round-expand-more";
const collapsedIconName = "ic:round-expand-less";

const accordionsStatus = reactive({
  'according-to-plan': false,
  'random-chargen': false,
})

type accordionKeys = keyof typeof accordionsStatus;

/*
 * Workaround this issue where the tailwindcss vite plugin tries to convert hsl() colors to hex codes, which impacts
 *   hsl(from hsl(...) ...) color specifications from working correctly.
 *
 *   https://github.com/tailwindlabs/tailwindcss/issues/18591
 *   https://github.com/tailwindlabs/tailwindcss/issues/18103
 *   https://github.com/tailwindlabs/tailwindcss/discussions/18110
 *
 * Trying this workaround to just use the main.css file out of the public/ directory, avoiding the css processing.
 */
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "/css/main.css"
    }
  ]
})

const title = ref('Triangle Table Maker');

function toggleAccordion(evt: MouseEvent, accordionName: accordionKeys) {
  const target = evt.target as HTMLElement;
  if (target) {
    const container = target.closest('.attribution');
    if (container) {
      container.classList.toggle('expanded')
      accordionsStatus[accordionName] = !accordionsStatus[accordionName];
    }
  }
}

</script>

<template>
  <div class="page-container">
    <NuxtRouteAnnouncer/>
    <h1>
      <NuxtLink v-if="route.path !== '/'" to="/" title="Triangle table maker home.">{{ title }}</NuxtLink>
      <span v-else>{{ title }}</span>
    </h1>
    <NuxtPage/>
    <footer>
      <span class="left">{{ appVersion }}</span>
      <div class="copyright-block">
        <p><span class="right">&copy; John Helmuth {{ copyrightDate }}</span>
          <a class="github-link" href="https://github.com/johnhelmuth/triangle-table-maker"
             title="Code repository for Triangle Table Maker at Github.com" target="_blank">
            <Icon name="octicon:mark-github-24" class="github-link-icon"/>
          </a></p>
        <div class="attribution random-chargen">
          <p class="attribution-text">
            This work uses material from
            <NuxtLink href="https://www.drivethrurpg.com/en/product/185683" target="_blank">
              "Random Character Creation in Fate Core"
            </NuxtLink>
            .
            <Icon :name="accordionsStatus['according-to-plan'] ? collapsedIconName : expandedIconName "
                  aria-hidden="false"
                  aria-role="button"
                  class="accordion-trigger"
                  @click="(evt) => toggleAccordion(evt, 'random-chargen')"
            />
          </p>
          <p class="accordion" aria-expanded="false">It was published by Magpie Games in The Fate Codex Volume 3, Issue
            3 and written by Philippe Saner, and is licensed under the Creative Commons Attribution 4.0 International
            license (http://creativecommons.org/licenses/by/4.0/
            deed.en_US).
          </p>
        </div>
        <div class="attribution according-to-plan">
          <p class="attribution-text">This work uses material from
            <NuxtLink href="https://www.drivethrurpg.com/en/product/302251" target="_blank">"According
              to Plan: a Game of Heists"
            </NuxtLink>
            <Icon :name="accordionsStatus['according-to-plan'] ? collapsedIconName : expandedIconName "
                  aria-hidden="false"
                  aria-role="button"
                  class="accordion-trigger"
                  @click="(evt) => toggleAccordion(evt, 'according-to-plan')"
            />
          </p>
          <p class="accordion" aria-expanded="false">
            It was written by Alex Costello and is licensed under the Creative Commons Attribution-NonCommercial 4.0
            International License
            (http://creativecommons.org/licenses/by-nc/4.0).
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>

.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-container > * {
  width: calc(100vw - 10rem);
  flex: 1 1 100cqh;
}

.page-container h1 {
  flex: 1 0 auto;
}

.page-container h1 a {
  text-decoration: none;
  color: inherit;
}

.page-container footer {
  flex: 1 0 auto;
}

h1 {
  text-align: center;
}

footer {
  margin: 2rem 1rem 0.5rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  justify-content: space-between;
  align-items: start;
  height: fit-content;
}

footer > * {
  margin-left: 1rem;
}

footer > :first-child {
  margin-left: 0;
  margin-right: auto;
}

footer .copyright-block {
  display: flex;
  flex-direction: column;
  text-align: right;
  height: fit-content;
}

footer .copyright-block > :first-child {
  margin: 0;
}

footer .copyright-block div.attribution p.attribution-text {
  margin: 0.25rem;
}

footer .copyright-block div.attribution {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

footer .copyright-block div.attribution .accordion {
  display: none;
}

footer .copyright-block div.attribution.expanded .accordion {
  display: inline;
}

footer .copyright-block div.attribution .accordion {
  margin-top: 1rem;
}

.github-link {
  font-size: 1.5rem;
  text-decoration: none;
  margin-left: 1rem;
}
</style>
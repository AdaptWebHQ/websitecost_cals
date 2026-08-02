# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adaptweb.spec.ts >> AdaptWeb Platform E2E Suite >> Accessibility Audit - Home Page
- Location: tests\e2e\adaptweb.spec.ts:35:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 509

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#14161a",
+               "contrastRatio": 3.18,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#62676f",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.18 (foreground color: #62676f, background color: #14161a, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"mb-8 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground border border-border px-4 py-2 bg-card rounded-none\" style=\"opacity: 0; transform: translateY(5.11132px);\">Smart Estimation</div>",
+                 "target": Array [
+                   ".tracking-\\[0\\.25em\\]",
+                 ],
+               },
+               Object {
+                 "html": "<section class=\"w-full flex flex-col items-center justify-center pt-20 pb-12 relative bg-background overflow-hidden\">",
+                 "target": Array [
+                   ".pt-20",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.18 (foreground color: #62676f, background color: #14161a, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"mb-8 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground border border-border px-4 py-2 bg-card rounded-none\" style=\"opacity: 0; transform: translateY(5.11132px);\">Smart Estimation</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".tracking-\\[0\\.25em\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0e0f12",
+               "contrastRatio": 1.05,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#151619",
+               "fontSize": "54.0pt (72px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.05 (foreground color: #151619, background color: #0e0f12, font size: 54.0pt (72px), font weight: bold). Expected contrast ratio of 3:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<section class=\"w-full flex flex-col items-center justify-center pt-20 pb-12 relative bg-background overflow-hidden\">",
+                 "target": Array [
+                   ".pt-20",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.05 (foreground color: #151619, background color: #0e0f12, font size: 54.0pt (72px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h1 class=\"text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground m-0 leading-tight\" style=\"opacity: 0; transform: translateY(18.547px);\">Estimate your website cost <br class=\"hidden sm:block\"> before you build.</h1>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "h1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#16181d",
+               "contrastRatio": 4.28,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#777d87",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.28 (foreground color: #777d87, background color: #16181d, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(0.99462px) scale(0.998011);\">",
+                 "target": Array [
+                   ".bg-muted\\/50",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.28 (foreground color: #777d87, background color: #16181d, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-muted-foreground font-mono mt-0.5\">Minimalist luxury profile &amp; links repository.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-muted\\/50 > .gap-3.items-center.flex > div:nth-child(2) > .mt-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#16181d",
+               "contrastRatio": 4.28,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#777d87",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.28 (foreground color: #777d87, background color: #16181d, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(0.99462px) scale(0.998011);\">",
+                 "target": Array [
+                   ".bg-muted\\/50",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.28 (foreground color: #777d87, background color: #16181d, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-muted-foreground\">₹4,999</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-muted\\/50 > .gap-2.text-\\[10px\\].font-bold > span",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 3.44,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6a6f79",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.44 (foreground color: #6a6f79, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(2.03193px) scale(0.995936);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.44 (foreground color: #6a6f79, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-muted-foreground font-mono mt-0.5\">Elegant local portfolio and stylist manager.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(2) > .gap-3.items-center.flex > div:nth-child(2) > .mt-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 3.44,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6a6f79",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.44 (foreground color: #6a6f79, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(2.03193px) scale(0.995936);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.44 (foreground color: #6a6f79, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-muted-foreground\">₹19,999</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(2) > .gap-2.text-\\[10px\\].font-bold > span",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 4.17,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#7b7c81",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.17 (foreground color: #7b7c81, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.9269px) scale(0.992146);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.17 (foreground color: #7b7c81, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-xs font-bold text-foreground uppercase tracking-wider\">Fine Dining Bistro</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3) > .gap-3.items-center.flex > div:nth-child(2) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 2.43,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#545861",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.9269px) scale(0.992146);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-muted-foreground font-mono mt-0.5\">Menu showcase with digital booking forms.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3) > .gap-3.items-center.flex > div:nth-child(2) > .mt-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 2.43,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#545861",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.9269px) scale(0.992146);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-muted-foreground\">₹39,999</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3) > .gap-2.text-\\[10px\\].font-bold > span",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 1.81,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#43454a",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.81 (foreground color: #43454a, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.89347px) scale(0.986213);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.81 (foreground color: #43454a, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-xs font-bold text-foreground uppercase tracking-wider\">Ripped Fitness Portal</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4) > .gap-3.items-center.flex > div:nth-child(2) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 1.41,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#32353c",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.41 (foreground color: #32353c, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.89347px) scale(0.986213);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.41 (foreground color: #32353c, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[10px] text-muted-foreground font-mono mt-0.5\">Fitness scheduler, classes, and trainer grids.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4) > .gap-3.items-center.flex > div:nth-child(2) > .mt-0\\.5",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 1.41,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#32353c",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.41 (foreground color: #32353c, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.89347px) scale(0.986213);\">",
+                 "target": Array [
+                   ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden\">",
+                 "target": Array [
+                   ".lg\\:col-span-7",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.41 (foreground color: #32353c, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-muted-foreground\">₹69,999</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(4) > .gap-2.text-\\[10px\\].font-bold > span",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - banner [ref=e13]:
      - generic [ref=e14]:
        - link "AdaptWeb Cost Calculator" [ref=e15] [cursor=pointer]:
          - /url: /
          - img [ref=e17]
          - generic [ref=e19]: AdaptWeb Cost Calculator
        - navigation [ref=e20]:
          - link "About" [ref=e21] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=e22] [cursor=pointer]:
            - /url: /faq
          - link "Privacy" [ref=e23] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e24] [cursor=pointer]:
            - /url: /terms
        - generic [ref=e25]:
          - button "Switch to Light Mode" [ref=e26] [cursor=pointer]:
            - img
          - generic [ref=e27]:
            - link "Sign In" [ref=e28] [cursor=pointer]:
              - /url: /login
              - button "Sign In" [ref=e29]
            - link "Get Started" [ref=e30] [cursor=pointer]:
              - /url: /register
              - button "Get Started" [ref=e31]
    - main [ref=e32]:
      - generic [ref=e34]:
        - generic [ref=e35]: Smart Estimation
        - heading "Estimate your website cost before you build." [level=1] [ref=e36]:
          - text: Estimate your website cost
          - text: before you build.
        - paragraph [ref=e37]: Get an accurate price for your project instantly. Choose your features, plan your budget, and launch your modern website with complete transparency.
        - link "Calculate My Cost" [ref=e39] [cursor=pointer]:
          - /url: /public/calculator
          - img [ref=e40]
          - text: Calculate My Cost
        - generic [ref=e44]:
          - img "Corporate & Agency" [ref=e46]
          - generic [ref=e47]:
            - generic [ref=e52]: Corporate & Agency
            - generic [ref=e53]: 01 / 05
      - generic [ref=e60]:
        - generic [ref=e61]:
          - generic [ref=e62]: How It Works
          - heading "From idea to accurate estimate." [level=2] [ref=e63]
          - paragraph [ref=e64]: A clear, straightforward path to understanding your website investment. No guesswork required.
        - generic [ref=e65]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e70]
              - generic [ref=e73]: Step 01 — Business
            - heading "Select Your Business Type" [level=3] [ref=e74]
            - paragraph [ref=e75]: Define your industry, and we will recommend the essential pages and features your specific business needs to thrive.
          - generic [ref=e76]:
            - generic [ref=e77]:
              - img [ref=e79]
              - generic [ref=e83]: Step 02 — Features
            - heading "Choose Your Features" [level=3] [ref=e84]
            - paragraph [ref=e85]: Add exactly what you want—from secure payment gateways to scheduling systems—and skip what you don’t.
          - generic [ref=e86]:
            - generic [ref=e87]:
              - img [ref=e89]
              - generic [ref=e91]: Step 03 — Estimate
            - heading "Review Your Estimate" [level=3] [ref=e92]
            - paragraph [ref=e93]: Watch the cost update instantly. Get a transparent, itemized breakdown of your website project.
          - generic [ref=e94]:
            - generic [ref=e95]:
              - img [ref=e97]
              - generic [ref=e102]: Step 04 — Launch
            - heading "Connect & Launch" [level=3] [ref=e103]
            - paragraph [ref=e104]: Send your approved estimate directly to our team, and let us turn your vision into a professional digital experience.
      - generic [ref=e108]:
        - generic [ref=e109]:
          - generic [ref=e110]: Interactive Pricing
          - heading "Build your ideal website. See the cost instantly." [level=3] [ref=e111]:
            - text: Build your ideal website.
            - text: See the cost instantly.
          - paragraph [ref=e112]: Every business is unique. Use our transparent calculator to explore different pages, features, and custom integrations. Shape your project exactly how you want it, and know the price before you make a commitment.
        - generic [ref=e115]:
          - generic [ref=e116]:
            - img [ref=e117]
            - text: Live Demo Running
          - generic [ref=e120]:
            - generic [ref=e121]:
              - generic [ref=e122]:
                - generic [ref=e123]: Configure Project
                - generic [ref=e124]: Segment 01 / 04
              - generic [ref=e127]:
                - generic [ref=e128]:
                  - heading "Select Core Architecture" [level=3] [ref=e129]
                  - paragraph [ref=e130]: Select a starting theme package corresponding to your project niche.
                - generic [ref=e131]:
                  - generic [ref=e132] [cursor=pointer]:
                    - generic [ref=e133]:
                      - img [ref=e135]
                      - generic [ref=e138]:
                        - heading "vCard Business Card" [level=4] [ref=e139]
                        - paragraph [ref=e140]: Minimalist luxury profile & links repository.
                    - generic [ref=e141]:
                      - generic [ref=e142]: ₹4,999
                      - img [ref=e144]
                  - generic [ref=e146] [cursor=pointer]:
                    - generic [ref=e147]:
                      - img [ref=e149]
                      - generic [ref=e151]:
                        - heading "Salon & Spa Wellness" [level=4] [ref=e152]
                        - paragraph [ref=e153]: Elegant local portfolio and stylist manager.
                    - generic [ref=e155]: ₹19,999
                  - generic [ref=e156] [cursor=pointer]:
                    - generic [ref=e157]:
                      - img [ref=e159]
                      - generic [ref=e162]:
                        - heading "Fine Dining Bistro" [level=4] [ref=e163]
                        - paragraph [ref=e164]: Menu showcase with digital booking forms.
                    - generic [ref=e166]: ₹39,999
                  - generic [ref=e167] [cursor=pointer]:
                    - generic [ref=e168]:
                      - img [ref=e170]
                      - generic [ref=e176]:
                        - heading "Ripped Fitness Portal" [level=4] [ref=e177]
                        - paragraph [ref=e178]: Fitness scheduler, classes, and trainer grids.
                    - generic [ref=e180]: ₹69,999
                  - generic [ref=e181] [cursor=pointer]:
                    - generic [ref=e182]:
                      - img [ref=e184]
                      - generic [ref=e186]:
                        - heading "Metrics SaaS Dashboard" [level=4] [ref=e187]
                        - paragraph [ref=e188]: Premium platform with data charts and sheets.
                    - generic [ref=e190]: ₹99,999
            - generic [ref=e191]:
              - button "Back" [disabled] [ref=e192]:
                - img [ref=e193]
                - text: Back
              - button "Continue" [ref=e195] [cursor=pointer]:
                - text: Continue
                - img [ref=e196]
          - generic [ref=e199]:
            - generic [ref=e205]: alexcarter.me
            - generic [ref=e208]:
              - img "Digital Business Card preview" [ref=e210]
              - generic [ref=e211]: Digital Business Card
      - generic [ref=e215]:
        - generic [ref=e216]:
          - generic [ref=e217]:
            - generic [ref=e218]: Phase 01
            - heading "High-Performance Dashboards" [level=3] [ref=e220]
            - paragraph [ref=e221]: Complex data visualizations built on rigid architectural grid systems. No soft corners, pure data. Built for scale and speed.
          - generic [ref=e222]:
            - img "High-Performance Dashboards 1" [ref=e224]
            - img "High-Performance Dashboards 2" [ref=e226]
            - img "High-Performance Dashboards 3" [ref=e228]
        - generic [ref=e229]:
          - generic [ref=e230]:
            - generic [ref=e231]: Phase 02
            - heading "Mobile-First Fintech" [level=3] [ref=e233]
            - paragraph [ref=e234]: Stark white numerics on pure black backgrounds. Zero latency, hyper-responsive touch targets. Designed for immediate transaction feedback.
          - generic [ref=e235]:
            - img "Mobile-First Fintech 1" [ref=e237]
            - img "Mobile-First Fintech 2" [ref=e239]
            - img "Mobile-First Fintech 3" [ref=e241]
        - generic [ref=e242]:
          - generic [ref=e243]:
            - generic [ref=e244]: Phase 03
            - heading "Corporate Architecture" [level=3] [ref=e246]
            - paragraph [ref=e247]: Monospace typography mixed with high-contrast structural layouts. Enterprise grade delivery tailored to showcase immense value.
          - generic [ref=e248]:
            - img "Corporate Architecture 1" [ref=e250]
            - img "Corporate Architecture 2" [ref=e252]
            - img "Corporate Architecture 3" [ref=e254]
    - contentinfo [ref=e255]:
      - generic [ref=e256]:
        - generic [ref=e257]:
          - paragraph [ref=e258]: AdaptWeb IT Solutions
          - paragraph [ref=e259]: © 2026 AdaptWeb IT Solutions. All rights reserved.
        - generic [ref=e260]:
          - link "Privacy Policy" [ref=e261] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e262] [cursor=pointer]:
            - /url: /terms
          - link "Contact Us" [ref=e263] [cursor=pointer]:
            - /url: /contact
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AxeBuilder } from '@axe-core/playwright';
  3   | 
  4   | // Helper to inject mock auth cookie for E2E testing bypassing Google Sign-In
  5   | async function mockLogin(context, role: 'admin' | 'public') {
  6   |   const uid = role === 'admin' ? 'admin_uid' : 'public_uid';
  7   |   const email = role === 'admin' ? 'admin@example.com' : 'public@example.com';
  8   |   const name = role === 'admin' ? 'Admin User' : 'Public User';
  9   |   const mockToken = `mock_${role}:${uid}:${email}:${name}`;
  10  | 
  11  |   await context.addCookies([
  12  |     {
  13  |       name: 'webcost_session_token',
  14  |       value: mockToken,
  15  |       domain: 'localhost',
  16  |       path: '/',
  17  |       httpOnly: true,
  18  |       secure: false,
  19  |       sameSite: 'Lax',
  20  |     },
  21  |     {
  22  |       name: 'webcost_user_role',
  23  |       value: role,
  24  |       domain: 'localhost',
  25  |       path: '/',
  26  |       httpOnly: true,
  27  |       secure: false,
  28  |       sameSite: 'Lax',
  29  |     },
  30  |   ]);
  31  | }
  32  | 
  33  | test.describe('AdaptWeb Platform E2E Suite', () => {
  34  |   
  35  |   test('Accessibility Audit - Home Page', async ({ page }) => {
  36  |     await page.goto('/');
  37  |     // Check main title
  38  |     await expect(page.locator('text=Build your ideal website').first()).toBeVisible();
  39  | 
  40  |     // Run axe accessibility check
  41  |     const accessibilityScanResults = await new AxeBuilder({ page })
  42  |       .exclude('iframe') // Exclude Google Maps/third-party widgets if present
  43  |       .analyze();
  44  |       
> 45  |     expect(accessibilityScanResults.violations).toEqual([]);
      |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  46  |   });
  47  | 
  48  |   test('Calculator Wizard Flow & Price Estimation', async ({ page, context }) => {
  49  |     // Authenticate as public user
  50  |     await mockLogin(context, 'public');
  51  |     
  52  |     // Go to calculator
  53  |     await page.goto('/public/calculator');
  54  |     
  55  |     // 1. Business details step
  56  |     await page.fill('input[placeholder="e.g. Acme Corporation"]', 'Test Company LLC');
  57  |     await page.fill('input[placeholder="name@company.com"]', 'test@company.com');
  58  |     await page.fill('input[placeholder="+1 (555) 000-0000"]', '+919999999999');
  59  |     
  60  |     const nextBtn = page.locator('button:has-text("Next Step")');
  61  |     await nextBtn.click();
  62  |     
  63  |     // 2. Industry step
  64  |     await page.click('button:has-text("Select")');
  65  |     await nextBtn.click();
  66  |     
  67  |     // 3. Package step
  68  |     await page.click('button:has-text("Select")');
  69  |     await nextBtn.click();
  70  |     
  71  |     // 4. Features step & custom addon insertion
  72  |     await page.fill('input[placeholder="e.g. Salesforce CRM Sync"]', 'Salesforce CRM Sync');
  73  |     await page.fill('input[placeholder="5000"]', '8000');
  74  |     await page.click('button:has-text("Add")');
  75  |     
  76  |     // Check that custom feature is added and listed
  77  |     await expect(page.locator('text=Salesforce CRM Sync')).toBeVisible();
  78  |     await nextBtn.click();
  79  |     
  80  |     // 5. Rush delivery timeline step
  81  |     await nextBtn.click();
  82  |     
  83  |     // 6. Summary and Finalization
  84  |     await expect(page.locator('text=Breakdown Details')).toBeVisible();
  85  |     
  86  |     // Run accessibility check on the final step
  87  |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  88  |     expect(accessibilityScanResults.violations).toEqual([]);
  89  |   });
  90  | 
  91  |   test('Admin Logs Dashboard and Searching', async ({ page, context }) => {
  92  |     // Authenticate as administrator
  93  |     await mockLogin(context, 'admin');
  94  |     
  95  |     await page.goto('/admin/packages');
  96  |     
  97  |     // Check admin panel layout
  98  |     await expect(page.locator('text=Quotation Package')).toBeVisible();
  99  |     
  100 |     // Run accessibility audit on admin list
  101 |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  102 |     expect(accessibilityScanResults.violations).toEqual([]);
  103 |   });
  104 | });
  105 | 
```
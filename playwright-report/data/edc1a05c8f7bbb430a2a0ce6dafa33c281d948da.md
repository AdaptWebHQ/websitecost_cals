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
+               "bgColor": "#181a20",
+               "contrastRatio": 4.19,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#777d87",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.19 (foreground color: #777d87, background color: #181a20, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
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
+   Element has insufficient color contrast of 4.19 (foreground color: #777d87, background color: #181a20, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-xs text-muted-foreground mt-1 font-mono\">Select a starting theme package corresponding to your project niche.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#16181e",
+               "contrastRatio": 3.26,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#656a74",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.26 (foreground color: #656a74, background color: #16181e, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(1.895773px) scale(0.996208);\">",
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
+   Element has insufficient color contrast of 3.26 (foreground color: #656a74, background color: #16181e, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#16181e",
+               "contrastRatio": 3.26,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#656a74",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.26 (foreground color: #656a74, background color: #16181e, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(1.895773px) scale(0.996208);\">",
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
+   Element has insufficient color contrast of 3.26 (foreground color: #656a74, background color: #16181e, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 4.23,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#7c7d82",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.23 (foreground color: #7c7d82, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.688947px) scale(0.992622);\">",
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
+   Element has insufficient color contrast of 4.23 (foreground color: #7c7d82, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-xs font-bold text-foreground uppercase tracking-wider\">Salon &amp; Spa Wellness</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(2) > .gap-3.items-center.flex > div:nth-child(2) > h4",
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
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.688947px) scale(0.992622);\">",
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
+   Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(3.688947px) scale(0.992622);\">",
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
+   Element has insufficient color contrast of 2.43 (foreground color: #545861, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 2.15,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#4e5055",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.15 (foreground color: #4e5055, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.558394px) scale(0.986883);\">",
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
+   Element has insufficient color contrast of 2.15 (foreground color: #4e5055, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.57,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#393c44",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.57 (foreground color: #393c44, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.558394px) scale(0.986883);\">",
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
+   Element has insufficient color contrast of 1.57 (foreground color: #393c44, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.57,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#393c44",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.57 (foreground color: #393c44, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(6.558394px) scale(0.986883);\">",
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
+   Element has insufficient color contrast of 1.57 (foreground color: #393c44, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.06,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#1e2026",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.06 (foreground color: #1e2026, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(9.640653px) scale(0.980719);\">",
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
+   Element has insufficient color contrast of 1.06 (foreground color: #1e2026, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.04,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#1c1e24",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.04 (foreground color: #1c1e24, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(9.640653px) scale(0.980719);\">",
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
+   Element has insufficient color contrast of 1.04 (foreground color: #1c1e24, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.04,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#1c1e24",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.04 (foreground color: #1c1e24, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(9.640653px) scale(0.980719);\">",
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
+   Element has insufficient color contrast of 1.04 (foreground color: #1c1e24, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
  - alert [ref=e13]
  - generic [ref=e14]:
    - banner [ref=e15]:
      - generic [ref=e16]:
        - link "AdaptWeb Cost Calculator" [ref=e17]:
          - /url: /
          - img [ref=e19]
          - generic [ref=e21]: AdaptWeb Cost Calculator
        - navigation [ref=e22]:
          - link "About" [ref=e23]:
            - /url: /about
          - link "FAQ" [ref=e24]:
            - /url: /faq
          - link "Privacy" [ref=e25]:
            - /url: /privacy
          - link "Terms" [ref=e26]:
            - /url: /terms
        - generic [ref=e27]:
          - button "Switch to Light Mode" [ref=e28] [cursor=pointer]:
            - img
          - generic [ref=e29]:
            - link "Sign In" [ref=e30]:
              - /url: /login
              - button "Sign In" [ref=e31]
            - link "Get Started" [ref=e32]:
              - /url: /register
              - button "Get Started" [ref=e33]
    - main [ref=e34]:
      - generic [ref=e36]:
        - generic [ref=e37]: Smart Estimation
        - heading "Estimate your website cost before you build." [level=1] [ref=e38]:
          - text: Estimate your website cost
          - text: before you build.
        - paragraph [ref=e39]: Get an accurate price for your project instantly. Choose your features, plan your budget, and launch your modern website with complete transparency.
        - link "Calculate My Cost" [ref=e41]:
          - /url: /public/calculator
          - img [ref=e42]
          - text: Calculate My Cost
        - generic [ref=e46]:
          - img "Corporate & Agency" [ref=e48]
          - generic [ref=e49]:
            - generic [ref=e54]: Corporate & Agency
            - generic [ref=e55]: 01 / 05
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]: How It Works
          - heading "From idea to accurate estimate." [level=2] [ref=e65]
          - paragraph [ref=e66]: A clear, straightforward path to understanding your website investment. No guesswork required.
        - generic [ref=e67]:
          - generic [ref=e69]:
            - generic [ref=e70]:
              - img [ref=e72]
              - generic [ref=e75]: Step 01 — Business
            - heading "Select Your Business Type" [level=3] [ref=e76]
            - paragraph [ref=e77]: Define your industry, and we will recommend the essential pages and features your specific business needs to thrive.
          - generic [ref=e78]:
            - generic [ref=e79]:
              - img [ref=e81]
              - generic [ref=e85]: Step 02 — Features
            - heading "Choose Your Features" [level=3] [ref=e86]
            - paragraph [ref=e87]: Add exactly what you want—from secure payment gateways to scheduling systems—and skip what you don’t.
          - generic [ref=e88]:
            - generic [ref=e89]:
              - img [ref=e91]
              - generic [ref=e93]: Step 03 — Estimate
            - heading "Review Your Estimate" [level=3] [ref=e94]
            - paragraph [ref=e95]: Watch the cost update instantly. Get a transparent, itemized breakdown of your website project.
          - generic [ref=e96]:
            - generic [ref=e97]:
              - img [ref=e99]
              - generic [ref=e104]: Step 04 — Launch
            - heading "Connect & Launch" [level=3] [ref=e105]
            - paragraph [ref=e106]: Send your approved estimate directly to our team, and let us turn your vision into a professional digital experience.
      - generic [ref=e110]:
        - generic [ref=e111]:
          - generic [ref=e112]: Interactive Pricing
          - heading "Build your ideal website. See the cost instantly." [level=3] [ref=e113]:
            - text: Build your ideal website.
            - text: See the cost instantly.
          - paragraph [ref=e114]: Every business is unique. Use our transparent calculator to explore different pages, features, and custom integrations. Shape your project exactly how you want it, and know the price before you make a commitment.
        - generic [ref=e117]:
          - generic [ref=e118]:
            - img [ref=e119]
            - text: Live Demo Running
          - generic [ref=e122]:
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]: Configure Project
                - generic [ref=e126]: Segment 01 / 04
              - generic [ref=e129]:
                - generic [ref=e130]:
                  - heading "Select Core Architecture" [level=3] [ref=e131]
                  - paragraph [ref=e132]: Select a starting theme package corresponding to your project niche.
                - generic [ref=e133]:
                  - generic [ref=e134] [cursor=pointer]:
                    - generic [ref=e135]:
                      - img [ref=e137]
                      - generic [ref=e140]:
                        - heading "vCard Business Card" [level=4] [ref=e141]
                        - paragraph [ref=e142]: Minimalist luxury profile & links repository.
                    - generic [ref=e143]:
                      - generic [ref=e144]: ₹4,999
                      - img [ref=e146]
                  - generic [ref=e148] [cursor=pointer]:
                    - generic [ref=e149]:
                      - img [ref=e151]
                      - generic [ref=e153]:
                        - heading "Salon & Spa Wellness" [level=4] [ref=e154]
                        - paragraph [ref=e155]: Elegant local portfolio and stylist manager.
                    - generic [ref=e157]: ₹19,999
                  - generic [ref=e158] [cursor=pointer]:
                    - generic [ref=e159]:
                      - img [ref=e161]
                      - generic [ref=e164]:
                        - heading "Fine Dining Bistro" [level=4] [ref=e165]
                        - paragraph [ref=e166]: Menu showcase with digital booking forms.
                    - generic [ref=e168]: ₹39,999
                  - generic [ref=e169] [cursor=pointer]:
                    - generic [ref=e170]:
                      - img [ref=e172]
                      - generic [ref=e178]:
                        - heading "Ripped Fitness Portal" [level=4] [ref=e179]
                        - paragraph [ref=e180]: Fitness scheduler, classes, and trainer grids.
                    - generic [ref=e182]: ₹69,999
                  - generic [ref=e183] [cursor=pointer]:
                    - generic [ref=e184]:
                      - img [ref=e186]
                      - generic [ref=e188]:
                        - heading "Metrics SaaS Dashboard" [level=4] [ref=e189]
                        - paragraph [ref=e190]: Premium platform with data charts and sheets.
                    - generic [ref=e192]: ₹99,999
            - generic [ref=e193]:
              - button "Back" [disabled] [ref=e194]:
                - img [ref=e195]
                - text: Back
              - button "Continue" [ref=e197] [cursor=pointer]:
                - text: Continue
                - img [ref=e198]
          - generic [ref=e201]:
            - generic [ref=e207]: alexcarter.me
            - generic [ref=e210]:
              - img "Digital Business Card preview" [ref=e212]
              - generic [ref=e213]: Digital Business Card
      - generic [ref=e217]:
        - generic [ref=e218]:
          - generic [ref=e219]:
            - generic [ref=e220]: Phase 01
            - heading "High-Performance Dashboards" [level=3] [ref=e222]
            - paragraph [ref=e223]: Complex data visualizations built on rigid architectural grid systems. No soft corners, pure data. Built for scale and speed.
          - generic [ref=e224]:
            - img "High-Performance Dashboards 1" [ref=e226]
            - img "High-Performance Dashboards 2" [ref=e228]
            - img "High-Performance Dashboards 3" [ref=e230]
        - generic [ref=e231]:
          - generic [ref=e232]:
            - generic [ref=e233]: Phase 02
            - heading "Mobile-First Fintech" [level=3] [ref=e235]
            - paragraph [ref=e236]: Stark white numerics on pure black backgrounds. Zero latency, hyper-responsive touch targets. Designed for immediate transaction feedback.
          - generic [ref=e237]:
            - img "Mobile-First Fintech 1" [ref=e239]
            - img "Mobile-First Fintech 2" [ref=e241]
            - img "Mobile-First Fintech 3" [ref=e243]
        - generic [ref=e244]:
          - generic [ref=e245]:
            - generic [ref=e246]: Phase 03
            - heading "Corporate Architecture" [level=3] [ref=e248]
            - paragraph [ref=e249]: Monospace typography mixed with high-contrast structural layouts. Enterprise grade delivery tailored to showcase immense value.
          - generic [ref=e250]:
            - img "Corporate Architecture 1" [ref=e252]
            - img "Corporate Architecture 2" [ref=e254]
            - img "Corporate Architecture 3" [ref=e256]
    - contentinfo [ref=e257]:
      - generic [ref=e258]:
        - generic [ref=e259]:
          - paragraph [ref=e260]: AdaptWeb IT Solutions
          - paragraph [ref=e261]: © 2026 AdaptWeb IT Solutions. All rights reserved.
        - generic [ref=e262]:
          - link "Privacy Policy" [ref=e263]:
            - /url: /privacy
          - link "Terms of Service" [ref=e264]:
            - /url: /terms
          - link "Contact Us" [ref=e265]:
            - /url: /contact
  - region "Notifications alt+T"
  - iframe [ref=e266]:
    
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
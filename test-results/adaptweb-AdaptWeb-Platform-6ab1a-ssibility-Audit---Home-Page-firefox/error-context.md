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
+ Received  + 468

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
+               "bgColor": "#1a523d",
+               "contrastRatio": 4.42,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#b5b5b6",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.42 (foreground color: #b5b5b6, background color: #1a523d, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"absolute -top-12 right-0 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2\" style=\"opacity: 0; transform: translateY(0.900672px);\">",
+                 "target": Array [
+                   ".-top-12",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"w-full bg-card\">",
+                 "target": Array [
+                   "main > .bg-card.w-full",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.42 (foreground color: #b5b5b6, background color: #1a523d, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"absolute -top-12 right-0 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2\" style=\"opacity: 0; transform: translateY(0.900672px);\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".-top-12",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#181a20",
+               "contrastRatio": 3.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#696e78",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.39 (foreground color: #696e78, background color: #181a20, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 3.39 (foreground color: #696e78, background color: #181a20, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#17191e",
+               "contrastRatio": 4.04,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#78797e",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.04 (foreground color: #78797e, background color: #17191e, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(2.66648px) scale(0.994667);\">",
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
+   Element has insufficient color contrast of 4.04 (foreground color: #78797e, background color: #17191e, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-xs font-bold text-foreground uppercase tracking-wider\">vCard Business Card</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-muted\\/50 > .gap-3.items-center.flex > div:nth-child(2) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#17191e",
+               "contrastRatio": 2.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#52565f",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.39 (foreground color: #52565f, background color: #17191e, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(2.66648px) scale(0.994667);\">",
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
+   Element has insufficient color contrast of 2.39 (foreground color: #52565f, background color: #17191e, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "bgColor": "#17191e",
+               "contrastRatio": 2.39,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#52565f",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.39 (foreground color: #52565f, background color: #17191e, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-primary bg-muted/50\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(2.66648px) scale(0.994667);\">",
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
+   Element has insufficient color contrast of 2.39 (foreground color: #52565f, background color: #17191e, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 2.47,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#57595d",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.47 (foreground color: #57595d, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(4.99332px) scale(0.990013);\">",
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
+   Element has insufficient color contrast of 2.47 (foreground color: #57595d, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.7,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#3e4149",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.7 (foreground color: #3e4149, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(4.99332px) scale(0.990013);\">",
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
+   Element has insufficient color contrast of 1.7 (foreground color: #3e4149, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.7,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#3e4149",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.7 (foreground color: #3e4149, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(4.99332px) scale(0.990013);\">",
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
+   Element has insufficient color contrast of 1.7 (foreground color: #3e4149, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.26,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#2b2d32",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.26 (foreground color: #2b2d32, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(8.24109px) scale(0.983518);\">",
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
+   Element has insufficient color contrast of 1.26 (foreground color: #2b2d32, background color: #181a20, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.14,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#23262c",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.14 (foreground color: #23262c, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(8.24109px) scale(0.983518);\">",
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
+   Element has insufficient color contrast of 1.14 (foreground color: #23262c, background color: #181a20, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+               "contrastRatio": 1.14,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#23262c",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.14 (foreground color: #23262c, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 border-border bg-card hover:bg-muted/30\" tabindex=\"0\" style=\"opacity: 0; transform: translateY(8.24109px) scale(0.983518);\">",
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
+   Element has insufficient color contrast of 1.14 (foreground color: #23262c, background color: #181a20, font size: 7.5pt (10px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-muted-foreground\">₹39,999</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-muted\\/30.p-3.cursor-pointer:nth-child(3) > .gap-2.text-\\[10px\\].font-bold > span",
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
  - alert [ref=e12]
  - generic [ref=e13]:
    - banner [ref=e14]:
      - generic [ref=e15]:
        - link "AdaptWeb Cost Calculator" [ref=e16] [cursor=pointer]:
          - /url: /
          - img [ref=e18]
          - generic [ref=e29]: AdaptWeb Cost Calculator
        - navigation [ref=e30]:
          - link "About" [ref=e31] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=e32] [cursor=pointer]:
            - /url: /faq
          - link "Privacy" [ref=e33] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e34] [cursor=pointer]:
            - /url: /terms
        - generic [ref=e35]:
          - button "Switch to Light Mode" [ref=e36] [cursor=pointer]:
            - img
          - generic [ref=e37]:
            - link "Sign In" [ref=e38] [cursor=pointer]:
              - /url: /login
              - button "Sign In" [ref=e39]
            - link "Get Started" [ref=e40] [cursor=pointer]:
              - /url: /register
              - button "Get Started" [ref=e41]
    - main [ref=e42]:
      - generic [ref=e44]:
        - generic [ref=e45]: Smart Estimation
        - heading "Estimate your website cost before you build." [level=1] [ref=e46]:
          - text: Estimate your website cost
          - text: before you build.
        - paragraph [ref=e47]: Get an accurate price for your project instantly. Choose your features, plan your budget, and launch your modern website with complete transparency.
        - link "Calculate My Cost" [ref=e49] [cursor=pointer]:
          - /url: /public/calculator
          - img [ref=e50]
          - text: Calculate My Cost
        - generic [ref=e63]:
          - img "Corporate & Agency" [ref=e65]
          - generic [ref=e66]:
            - generic [ref=e71]: Corporate & Agency
            - generic [ref=e72]: 01 / 05
      - generic [ref=e79]:
        - generic [ref=e80]:
          - generic [ref=e81]: How It Works
          - heading "From idea to accurate estimate." [level=2] [ref=e82]
          - paragraph [ref=e83]: A clear, straightforward path to understanding your website investment. No guesswork required.
        - generic [ref=e84]:
          - generic [ref=e86]:
            - generic [ref=e87]:
              - img [ref=e89]
              - generic [ref=e92]: Step 01 — Business
            - heading "Select Your Business Type" [level=3] [ref=e93]
            - paragraph [ref=e94]: Define your industry, and we will recommend the essential pages and features your specific business needs to thrive.
          - generic [ref=e95]:
            - generic [ref=e96]:
              - img [ref=e98]
              - generic [ref=e102]: Step 02 — Features
            - heading "Choose Your Features" [level=3] [ref=e103]
            - paragraph [ref=e104]: Add exactly what you want—from secure payment gateways to scheduling systems—and skip what you don’t.
          - generic [ref=e105]:
            - generic [ref=e106]:
              - img [ref=e108]
              - generic [ref=e119]: Step 03 — Estimate
            - heading "Review Your Estimate" [level=3] [ref=e120]
            - paragraph [ref=e121]: Watch the cost update instantly. Get a transparent, itemized breakdown of your website project.
          - generic [ref=e122]:
            - generic [ref=e123]:
              - img [ref=e125]
              - generic [ref=e130]: Step 04 — Launch
            - heading "Connect & Launch" [level=3] [ref=e131]
            - paragraph [ref=e132]: Send your approved estimate directly to our team, and let us turn your vision into a professional digital experience.
      - generic [ref=e136]:
        - generic [ref=e137]:
          - generic [ref=e138]: Interactive Pricing
          - heading "Build your ideal website. See the cost instantly." [level=3] [ref=e139]:
            - text: Build your ideal website.
            - text: See the cost instantly.
          - paragraph [ref=e140]: Every business is unique. Use our transparent calculator to explore different pages, features, and custom integrations. Shape your project exactly how you want it, and know the price before you make a commitment.
        - generic [ref=e143]:
          - generic [ref=e144]:
            - img [ref=e145]
            - text: Live Demo Running
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - generic [ref=e151]: Configure Project
                - generic [ref=e152]: Segment 01 / 04
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - heading "Select Core Architecture" [level=3] [ref=e157]
                  - paragraph [ref=e158]: Select a starting theme package corresponding to your project niche.
                - generic [ref=e159]:
                  - generic [ref=e160] [cursor=pointer]:
                    - generic [ref=e161]:
                      - img [ref=e163]
                      - generic [ref=e166]:
                        - heading "vCard Business Card" [level=4] [ref=e167]
                        - paragraph [ref=e168]: Minimalist luxury profile & links repository.
                    - generic [ref=e169]:
                      - generic [ref=e170]: ₹4,999
                      - img [ref=e172]
                  - generic [ref=e174] [cursor=pointer]:
                    - generic [ref=e175]:
                      - img [ref=e177]
                      - generic [ref=e183]:
                        - heading "Salon & Spa Wellness" [level=4] [ref=e184]
                        - paragraph [ref=e185]: Elegant local portfolio and stylist manager.
                    - generic [ref=e187]: ₹19,999
                  - generic [ref=e188] [cursor=pointer]:
                    - generic [ref=e189]:
                      - img [ref=e191]
                      - generic [ref=e195]:
                        - heading "Fine Dining Bistro" [level=4] [ref=e196]
                        - paragraph [ref=e197]: Menu showcase with digital booking forms.
                    - generic [ref=e199]: ₹39,999
                  - generic [ref=e200] [cursor=pointer]:
                    - generic [ref=e201]:
                      - img [ref=e203]
                      - generic [ref=e209]:
                        - heading "Ripped Fitness Portal" [level=4] [ref=e210]
                        - paragraph [ref=e211]: Fitness scheduler, classes, and trainer grids.
                    - generic [ref=e213]: ₹69,999
                  - generic [ref=e214] [cursor=pointer]:
                    - generic [ref=e215]:
                      - img [ref=e217]
                      - generic [ref=e222]:
                        - heading "Metrics SaaS Dashboard" [level=4] [ref=e223]
                        - paragraph [ref=e224]: Premium platform with data charts and sheets.
                    - generic [ref=e226]: ₹99,999
            - generic [ref=e227]:
              - button "Back" [disabled] [ref=e228]:
                - img [ref=e229]
                - text: Back
              - button "Continue" [ref=e231] [cursor=pointer]:
                - text: Continue
                - img [ref=e232]
          - generic [ref=e235]:
            - generic [ref=e241]: alexcarter.me
            - generic [ref=e244]:
              - img "Digital Business Card preview" [ref=e246]
              - generic [ref=e247]: Digital Business Card
      - generic [ref=e251]:
        - generic [ref=e252]:
          - generic [ref=e253]:
            - generic [ref=e254]: Phase 01
            - heading "High-Performance Dashboards" [level=3] [ref=e256]
            - paragraph [ref=e257]: Complex data visualizations built on rigid architectural grid systems. No soft corners, pure data. Built for scale and speed.
          - generic [ref=e258]:
            - img "High-Performance Dashboards 1" [ref=e260]
            - img "High-Performance Dashboards 2" [ref=e262]
            - img "High-Performance Dashboards 3" [ref=e264]
        - generic [ref=e265]:
          - generic [ref=e266]:
            - generic [ref=e267]: Phase 02
            - heading "Mobile-First Fintech" [level=3] [ref=e269]
            - paragraph [ref=e270]: Stark white numerics on pure black backgrounds. Zero latency, hyper-responsive touch targets. Designed for immediate transaction feedback.
          - generic [ref=e271]:
            - img "Mobile-First Fintech 1" [ref=e273]
            - img "Mobile-First Fintech 2" [ref=e275]
            - img "Mobile-First Fintech 3" [ref=e277]
        - generic [ref=e278]:
          - generic [ref=e279]:
            - generic [ref=e280]: Phase 03
            - heading "Corporate Architecture" [level=3] [ref=e282]
            - paragraph [ref=e283]: Monospace typography mixed with high-contrast structural layouts. Enterprise grade delivery tailored to showcase immense value.
          - generic [ref=e284]:
            - img "Corporate Architecture 1" [ref=e286]
            - img "Corporate Architecture 2" [ref=e288]
            - img "Corporate Architecture 3" [ref=e290]
    - contentinfo [ref=e291]:
      - generic [ref=e292]:
        - generic [ref=e293]:
          - paragraph [ref=e294]: AdaptWeb IT Solutions
          - paragraph [ref=e295]: © 2026 AdaptWeb IT Solutions. All rights reserved.
        - generic [ref=e296]:
          - link "Privacy Policy" [ref=e297] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e298] [cursor=pointer]:
            - /url: /terms
          - link "Contact Us" [ref=e299] [cursor=pointer]:
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
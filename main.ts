import ev2026 from "./2026.json" with { type: "json" };
import { html, minify } from "./html.ts";

const HEAD = minify(await Deno.readTextFile("head.html"));

await Deno.mkdir("public", { recursive: true });
await Deno.writeTextFile(
  "public/2026.html",
  HEAD + html(
    "body.blbl",
    html("h1", "Évènements"),
    ev2026.filter((event) => event.title).map((event) =>
      html(
        "div.bl",
        html("h2", event.title),
        !!event.date && html("div", fmtDate(event.date)),
        !!event.location && html("div", event.location),
        ...(event.notes || []).map((note) =>
          /^https?:\/\//.test(note)
            ? { h: `<div><a href='${note}'>${note}</a></div>` }
            : html("p", note)
        ),
      )
    ),
    html("div", "Généré le ", fmtDate()),
  ).h,
);

await Deno.writeTextFile(
  "public/2026l.html",
  HEAD + html(
    "body.lines",
    html("h1", "Évènements"),
    ev2026.filter((event) => event.title).map((event) =>
      html(
        "div.line",
        html(
          "div",
          html("h2", event.title),
          !!event.date && html("div", fmtDate(event.date)),
          !!event.location && html("div", event.location),
        ),
        html(
          "div.notes",
          ...(event.notes || []).map((note) =>
            /^https?:\/\//.test(note)
              ? { h: `<div><a href='${note}'>${note}</a></div>` }
              : html("p", note)
          ),
        ),
      )
    ),
    html("div", "Généré le ", fmtDate()),
  ).h,
);

function fmtDate(str: string = Date()): string {
  return Intl.DateTimeFormat("fr", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(str));
}

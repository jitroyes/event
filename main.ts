import ev2026 from "./2026.json" with { type: "json" };
import { html, minify } from "./html.ts";

const HEAD = minify(await Deno.readTextFile("head.html"));

await Deno.mkdir("public", { recursive: true });
await Deno.writeTextFile(
  "public/2026.html",
  HEAD + html(
    "body.withgrid",
    html(
      "header",
      html("h1", "Actions dans l'Aube"),
      html("i", "Généré le ", fmtDate()),
    ),
    !!ev2026.length && html("h2", "Actions"),
    html("div.grid2"),
    html(
      `div.grid2`,
      ev2026.filter((event) => event.title).map((event) =>
        html(
          "div.bl",
          html("div.type", "// évènement //"),
          html("h3", event.title),
          !!event.date && html("div.bold", fmtDate(event.date)),
          !!event.location && html("div.bold", event.location),
          ...(event.notes || []).map((note) =>
            /^https?:\/\//.test(note)
              ? { h: `<div><a href='${note}'>${note}</a></div>` }
              : html("p", note)
          ),
        )
      ),
    ),
  ).h,
);

// https://eci.ec.europa.eu/055/public/?lg=fr

function fmtDate(str: string = Date()): string {
  return Intl.DateTimeFormat("fr", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(str));
}

import ev2026 from "./2026.json" with { type: "json" };
import { html, htmlAttr } from "@huguesguilleus/blogger/html";

export function minify(data: string): string {
  return data.replaceAll(/(\/\*[\s\S]*?\*\/|\s+)/g, " ")
    .replaceAll(/([\W^-]) /g, "$1")
    .replaceAll(/ ([\W]^-)/g, "$1");
}
const HEAD = minify(await Deno.readTextFile("head.html"));

await Deno.mkdir("public", { recursive: true });
await Deno.writeTextFile(
  "public/index.html",
  HEAD + html(
    "body.withgrid",
    html(
      "header",
      html("h1", "Actions dans l'Aube"),
      html("i", "Généré le ", fmtDate()),
    ),
    // // //
    !!ev2026.length && [
      html("h2", "Évènements"),
      html(
        `div.blocks`,
        ev2026.filter((event) => event.title).map((event) =>
          html(
            "div.bl.event",
            html("div.type", "// évènement //"),
            html("h3", event.title),
            !!event.date && html("div.bold", fmtDate(event.date)),
            !!event.location && html("div.", event.location),
            ...(event.notes || []).map((note) =>
              /^https?:\/\//.test(note)
                ? htmlAttr`a href='${note}'`(note)
                : html("p", note)
            ),
          )
        ),
      ),
    ],
    //
    false && [
      html("h2", "Pétition"),
    ],
  ).h,
);

// https://eci.ec.europa.eu/055/public/?lg=fr

function fmtDate(str: string = Date()): string {
  return Intl.DateTimeFormat("fr", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(str));
}

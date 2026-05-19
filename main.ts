import { HTML, html, htmlAttr } from "@huguesguilleus/blogger/html";
import * as TOML from "@std/toml";

type Data = {
	social: {
		title: string;
		logo: string;
		url: string;
	}[];
	event: {
		title: string;
		date: Date;
		location: string;
		notes: string[];
	}[];
	petition: {
		title: string;
		notes: string[];
		url: string;
	}[];
};

const data = TOML.parse(await Deno.readTextFile("now.toml")) as Data;

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
			html("h1", "LFI dans l'Aube"),
			html("i", "Généré le ", fmtDate()),
		),
		// // //
		!!data.social.length && [
			html(
				"div.blocks",
				data.social.map((social) =>
					html(
						`a.link href='${social.url}'`,
						html("div", social.title),
					)
				),
			),
		],
		// // //
		!!data.event.length && [
			html("h2", "Les évènements"),
			html(
				"div.blocks",
				data.event.filter((event) => event.title).map((event) =>
					html(
						"div.bl.event",
						html("div.type", "// évènement //"),
						html("h3", event.title),
						!!event.date && html("div.bold", fmtDate(event.date)),
						!!event.location && html("div", event.location),
						notes(event.notes),
					)
				),
			),
		],
		// // //
		!!data.petition.length && [
			html("h2", "Les pétitions"),
			html(
				"div.blocks",
				data.petition.map((petition) =>
					html(
						"div.bl.petition",
						html("h3", petition.title),
						notes(petition.notes),
						html(`a href='${petition.url}'`, petition.url),
					)
				),
			),
		],
	).h,
);

function fmtDate(date = new Date()): string {
	return Intl.DateTimeFormat("fr", {
		dateStyle: "full",
		timeStyle: "medium",
	}).format(date);
}

function notes(lines: string[] = []): HTML[] {
	return lines.map((line) =>
		/^https?:\/\//.test(line)
			? htmlAttr`a href='${line}'`(line)
			: html("p", line)
	);
}

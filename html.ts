import { escape } from "@std/html";

/** A basic wrap to check that is a escaped HTML */
export interface HTML {
  h: string;
}

export type CHILDREN = false | string | HTML | (CHILDREN[]);

/**
 * Create a html element.
 * @param tag The tag with escaped attributes
 * @param children children. Is simple string, auto escape it.
 * @returns The HTML element.
 */
export function html(tag: string, ...children: CHILDREN[]): HTML {
  if (tag == "") {
    return { h: renderChildren("", children) };
  }

  const [tagNameAndClasses, tagEnd = ""] = tag.split(/(\ .*)/);
  const [rawTagName, ...classNames] = tagNameAndClasses.split(".");
  const tagName = rawTagName || "div";

  let h = "<" + tagName;
  if (classNames.length == 1) h += ` class=${classNames[0]}`;
  if (classNames.length > 1) h += ` class="${classNames.join(" ")}"`;
  if (tagEnd) h += tagEnd;
  h += ">";

  h = renderChildren(h, children);

  if (!notClosingTag.has(tagName)) {
    h += `</${tagName}>`;
  }

  return { h };
}

function renderChildren(h: string, children: CHILDREN): string {
  function append(child: CHILDREN) {
    if (Array.isArray(child)) {
      child.forEach(append);
    } else if (!child) {
      // do nothing
    } else if (typeof child === "string") {
      h += escape(child);
    } else {
      h += child?.h ?? "";
    }
  }
  append(children);
  return h;
}

const notClosingTag = new Set([
  // Source: https://html.spec.whatwg.org/multipage/syntax.html#elements-2
  // Do not close
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
  // we chose to not close these tag
  "html",
  "body",
]);

export function htmlRoot(tag: string, ...children: (string | HTML)[]): string {
  return `<!DOCTYPE html>` + html(tag, ...children).h;
}

export function minify(data: string): string {
  return data.replaceAll(/(\/\*[\s\S]*?\*\/|\s+)/g, " ")
    .replaceAll(/([\W^-]) /g, "$1")
    .replaceAll(/ ([\W]^-)/g, "$1");
}

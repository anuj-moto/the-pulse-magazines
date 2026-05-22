/**
 * Gutenberg/WordPress HTML → Payload Lexical rich-text conversion.
 *
 * Articles store editable Lexical (not raw HTML) so the owner can revise
 * old posts in the same WYSIWYG editor as new ones. The WordPress content
 * is clean Gutenberg markup, so Payload's deterministic HTML converter
 * handles it directly. Elementor-built pages are first reduced to their
 * readable content elements before conversion.
 */
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { SanitizedConfig } from 'payload'

export type EditorConfig = Awaited<ReturnType<typeof editorConfigFactory.default>>

/** Build the editor config that the `content` rich-text fields use. */
export async function buildEditorConfig(config: SanitizedConfig): Promise<EditorConfig> {
  return editorConfigFactory.default({ config })
}

/** An empty-but-valid Lexical document (single empty paragraph). */
export function emptyLexical() {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [],
        },
      ],
    },
  }
}

/** Decode entities and strip tags — for titles and excerpts. */
export function htmlToText(html: string): string {
  if (!html) return ''
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`)
  return (dom.window.document.body.textContent || '').replace(/\s+/g, ' ').trim()
}

/** Clean a WordPress excerpt: strip tags, drop the trailing "[…]" marker. */
export function cleanExcerpt(html: string): string {
  return htmlToText(html)
    .replace(/\[(?:…|\.\.\.|&hellip;)\]\s*$/i, '')
    .replace(/(?:Continue reading|Read more)\s*$/i, '')
    .trim()
}

/** Remove inline images — featured images are migrated separately. */
function stripImages(html: string): string {
  return html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, '')
}

/**
 * Reduce Elementor page markup to an ordered list of readable content
 * elements (headings, paragraphs, lists, quotes), discarding layout divs.
 */
export function extractReadableHtml(html: string): string {
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`)
  const blocks: string[] = []
  let lastText = ''

  dom.window.document.body
    .querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote')
    .forEach((el) => {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
      if (!text || text === lastText) return // skip empty + adjacent duplicates
      lastText = text
      // Demote h1 — the page title is the document h1.
      const tag = el.tagName.toLowerCase() === 'h1' ? 'h2' : el.tagName.toLowerCase()
      blocks.push(`<${tag}>${el.innerHTML}</${tag}>`)
    })

  return blocks.join('\n')
}

/**
 * Repair a converted Lexical tree:
 *  - unwrap link nodes with no usable URL (empty href / "#" anchors),
 *    which would otherwise fail Payload's "Enter a URL" validation.
 */
function sanitizeNode(node: any): any[] {
  if (!node || typeof node !== 'object') return [node]

  if (Array.isArray(node.children)) {
    node.children = node.children.flatMap(sanitizeNode)
  }

  if (node.type === 'link' || node.type === 'autolink') {
    const url = typeof node.fields?.url === 'string' ? node.fields.url.trim() : ''
    const isInternal = node.fields?.linkType === 'internal' && node.fields?.doc
    if (!isInternal && (url === '' || url === '#')) {
      // Drop the broken link, keep its text content.
      return Array.isArray(node.children) ? node.children : []
    }
  }
  return [node]
}

function sanitizeLexical(state: any) {
  if (state?.root?.children) {
    state.root.children = state.root.children.flatMap(sanitizeNode)
    if (state.root.children.length === 0) return emptyLexical()
  }
  return state
}

/** Convert cleaned HTML to a Lexical editor state. */
export function htmlToLexical(html: string, editorConfig: EditorConfig) {
  const cleaned = stripImages(html || '').trim()
  if (!cleaned) return emptyLexical()

  try {
    const state = convertHTMLToLexical({ editorConfig, html: cleaned, JSDOM })
    if (!state?.root?.children?.length) return emptyLexical()
    return sanitizeLexical(state)
  } catch {
    return emptyLexical()
  }
}

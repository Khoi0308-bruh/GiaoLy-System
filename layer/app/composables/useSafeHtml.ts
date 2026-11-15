import DOMPurify from 'isomorphic-dompurify'

export function useSafeHtml() {
  function sanitize(dirty: string | null | undefined): string {
    if (!dirty) return ''
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br',
        'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'title']
    })
  }

  return { sanitize }
}

const PREVIEW_LENGTH = 30;

export const helpers = {
    lengthOfList: (list = []) => list.length,
    eq: (val1, val2) => val1 === val2,
    dateString: (isoString) => new Date(isoString).toLocaleDateString(),
    subtract: (val1, val2) => val1 - val2,
    preview: (content) => content.length > PREVIEW_LENGTH ? content.slice(0, PREVIEW_LENGTH) + "..." : content,
}
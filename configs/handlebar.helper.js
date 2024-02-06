export const helpers = {
    lengthOfList: (list = []) => list.length,
    eq: (val1, val2) => val1 === val2,
    dateString: (isoString) => new Date(isoString).toLocaleDateString(),
    subtract: (val1, val2) => val1 - val2,
}

export function getSqlDate (date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function sqlDate2jsDate (sqlDate) {
    return new Date(sqlDate);
}
export function validateEmail(value: string): boolean {
    // eslint-disable-next-line max-len
    const pattern = new RegExp("^([A-Z|a-z|0-9](\.|_|:){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){0,2}\.[a-z]{2,3}$", "igm");
    return pattern.test(value);
}

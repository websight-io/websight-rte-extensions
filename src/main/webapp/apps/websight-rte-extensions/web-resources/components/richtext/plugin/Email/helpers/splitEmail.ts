type Parts = {
    'data-part1': string
    'data-part2': string
    'data-part3': string
}

export function splitEmail(href: string): Parts {
    const firstPart = href.split('@')[0];
    const secondPart = href.split('@')[1];
    const data1 = firstPart;
    const data2 = secondPart.split('.')[0];
    const data3 = secondPart.split('.')[1];
    return { 
        'data-part1': data1, 
        'data-part2': data2, 
        'data-part3': data3};
}

import {jsx} from 'slate-hyperscript';

const deserialize = (el) => {
    // console.log('el:', el, ' nodeType:', el.nodeType, ' nodeName:', el.nodeName, ' textContext:', el.textContext);
    if (el.nodeType === 3) {
        return el.textContent;
    }
    else if (el.nodeType !== 1) {
        return null;
    }

    const children = Array.from(el.childNodes).map(deserialize);
    switch (el.nodeName) {
        case 'BODY':
            return jsx('fragment', {}, children);
        case 'BR':
            return '\n';
        case 'BLOCKQUOTE':
            return jsx('element', {type: 'quote'}, children);
        case 'P':
            return jsx('element', {type: 'paragraph'}, children);
        case 'A':
            return jsx(
                'element',
                {
                    type: 'link',
                    url: el.getAttribute('href')
                },
                children
            );
        default:
            return el.textContent;
    }
}

export {
    deserialize
}



import {useEffect, useCallback, useMemo, useState } from 'react';
import { createEditor, Editor, Transforms, Text, Node } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import {deserialize as deserializeHtml} from '../../utils/deserialize.js';
import './index.css';

const serialize = value => {
    return (
        value.map(node => {
            Node.string(node);
        })
            .join('\n')
    )
}

const deserialize = string => {
    return string.split('\n').map(line => {
        return {
            children: [
                {
                    text: line,
                },
            ],
        };
    });
}

const CodeElement = (props) => {
    return <pre {...props.attributes} className='pre-code'>
        <code>{props.children}</code>
    </pre>;
};

const QuoteElement = (props) => {
    return <blockquote style={{ color: 'green' }} {...props.attributes}>{props.children}</blockquote>;
}

const DefaultElement = (props) => {
    console.log('defalt element', props);
    return <p {...props.attributes}>{props.children}</p>;
}

const Leaf = (props) => {
    return <span
        {...props.attributes}
        style={
            {
                fontWeight: props.leaf.bold ? 'bold' : 'normal',
                fontStyle: props.leaf.italic ? 'italic' : 'normal',
            }
        }
    >
        {props.children}
    </span>;
}

const MyEditor = {
    ...Editor,
    insertImage(editor, url) {
        const element = {
            type: 'image',
            url,
            children: [
                {
                    text: '',
                },
            ],
        };
        Transforms.insertNodes(editor, element);
    },
};

const MyElement = {
    ...Element,
    isImageElement(element) {
        return Element.isElement(element) && element.type === 'image';
    },
};

const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: node => {
                    return node.bold === true;
                },
                universal: true,
            },
        );
        return !!match;
    },
    isItalicMarkActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: node => {
                    return node.italic === true;
                },
                universal: true,
            },
        );
        return !!match;
    },
    isLinkActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: node => {
                    return node.type === 'link';
                }
            }
        );
        return !!match;
    },
    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: node => {
                    return node.type === 'code'
                },
            },
        );
        return !!match;
    },
    isBlockQuoteActive(editor) {
        const [match] = Editor.nodes(
            editor,
            {
                match: node => {
                    return node.type === 'quote';
                }
            }
        );
        return !!match;
    },
    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor);
        Transforms.setNodes(
            editor,
            {
                bold: isActive ? null : true,
            },
            {
                match: node => {
                    return Text.isText(node);
                },
                split: true,
            }
        );
    },
    toggleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor);
        Transforms.setNodes(
            editor,
            {
                italic: isActive ? null : true,
            },
            {
                match: node => {
                    return Text.isText(node);
                },
            },
        );
    },
    toggleCodeMark(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor);
        Transforms.setNodes(
            editor,
            {
                type: isActive ? null : 'code',
            },
            {
                match: node => {
                    return Editor.isBlock(editor, node);
                }
            }
        )
    },
    toggleBlockQuote(editor) {
        const isActive = CustomEditor.isBlockQuoteActive(editor);
        Transforms.setNodes(
            editor,
            {
                type: isActive ? null : 'quote',
            },
            {
                match: node => {
                    return Editor.isBlock(editor, node);
                }
            }
        )
    }
}

const withImages = editor => {
    const { isVoid } = editor;
    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element);
    }
    return editor;
}

function Home() {
    

    const initValue = JSON.parse(localStorage.getItem('content')) || [
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ];
    const [value, setValue] = useState(initValue);
    const editor = useMemo(() => withReact(createEditor()), []);
    // const editor = useMemo(() => withImages(createEditor()), []);
    const { isInline, insertText, isVoid } = editor;

    useEffect(() => {
        // const html = '<p>An opening paragraph with a <a href="https://example.com">link</a> in it.</p><blockquote><p>A wise quote.</p></blockquote><p>A closing paragraph!</p>';
        // const document = new DOMParser().parseFromString(html, 'text/html');
        // const content = deserializeHtml(document.body);
        // // setValue(content);
        // console.log('content:', content);
        // console.log('value', value);
    }, []);

    const handleValueChange = (newValue) => {
        // console.log('new value ', newValue);
        setValue(newValue);
        const content = JSON.stringify(newValue);
        localStorage.setItem('content', content);
        // const descendant = Node.get(newValue, [0, 0]);
        // console.log('descendant 0', descendant);
    }

    const handleKeyDown = (e) => {
        if (!e.ctrlKey) {
            return;
        }
        switch (e.key) {
            case '`':
                e.preventDefault();
                CustomEditor.toggleCodeMark(editor);
                break;
            case 'b':
                e.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
        }
    }

    const renderElement = useCallback((props) => {
        console.log('render element props', props);
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />;
            case 'quote':
                return <QuoteElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    const renderLeaf = useCallback((props) => {
        console.log('render leaf props', props);
        return <Leaf {...props} />;
    }, []);



    const handleBeforeInput = (e) => {
        // 中文输入法
        // console.log('before input e', e);
        const value = e.data;
        insertText('----' + value + '----')
        // const path = e.nativeEvent.path;
        // const descendant = 
    }



    return <div className="home-wrap">
        <Slate
            editor={editor}
            value={value}
            onChange={handleValueChange}
        >
            <Toolbar />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeyDown}
                onBeforeInputCapture={handleBeforeInput}
            />
        </Slate>
    </div>;
}

function Toolbar(props) {
    const editor = useSlate();

    const handleBoldBtnClick = (e) => {
        e.preventDefault();
        CustomEditor.toggleBoldMark(editor);
    };

    const handleItalicBtnClick = (e) => {
        e.preventDefault();
        CustomEditor.toggleItalicMark(editor);
    };

    const handleCodeBtnClick = (e) => {
        e.preventDefault();
        CustomEditor.toggleCodeMark(editor);
    };

    const handleBlockQuoteClick = (e) => {
        e.preventDefault();
        CustomEditor.toggleBlockQuote(editor);
    };

    return <div className="tollbar">
        <button
            onClick={handleBoldBtnClick}
            className={CustomEditor.isBoldMarkActive(editor) ? 'active-bgcolor' : ''}
        >
            bold
        </button>
        <button
            onClick={handleItalicBtnClick}
            className={CustomEditor.isItalicMarkActive(editor) ? 'active-bgcolor' : ''}
        >
            italic
        </button>
        <button
            onClick={handleCodeBtnClick}
            className={CustomEditor.isCodeBlockActive(editor) ? 'active-bgcolor' : ''}
        >
            code block
        </button>
        <button
            onClick={handleBlockQuoteClick}
            className={CustomEditor.isBlockQuoteActive(editor) ? 'active-bgcolor' : ''}
        >
            block quote
            </button>
        <button>link</button>
    </div>;
}

export default Home;
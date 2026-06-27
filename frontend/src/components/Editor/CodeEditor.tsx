import Editor, { OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { Comment, RemoteCursor } from '@/types';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string, cursorPosition?: any) => void;
  onCursorChange: (position: any) => void;
  remoteCursors: RemoteCursor[];
  comments: Comment[];
  readOnly?: boolean;
}

export function CodeEditor({ code, language, onChange, onCursorChange, remoteCursors, comments, readOnly }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const cursorDecorationsRef = useRef<string[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    addCommentDecorations(editor, monaco, comments);

    editor.onDidChangeCursorPosition((e) => {
      onCursorChange(e.position);
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        const position = editorRef.current.getPosition();
        editorRef.current.setValue(code);
        if (position) editorRef.current.setPosition(position);
      }
    }
  }, [code]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const decorations = comments.map((comment) => ({
      range: new monaco.Range(comment.lineNumber, 1, comment.lineNumber, 1),
      options: {
        glyphMarginClassName: 'comment-glyph-marker',
        glyphMarginHoverMessage: { value: `**${comment.authorName}:** ${comment.text}` },
      },
    }));
    
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
  }, [comments]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const decorations = remoteCursors.map(cursor => ({
      range: new monaco.Range(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column),
      options: {
        className: 'remote-cursor',
        hoverMessage: { value: cursor.username },
      }
    }));
    
    cursorDecorationsRef.current = editor.deltaDecorations(cursorDecorationsRef.current, decorations);
  }, [remoteCursors]);

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(val) => {
        if (editorRef.current) {
          onChange(val || '', editorRef.current.getPosition());
        } else {
          onChange(val || '');
        }
      }}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        glyphMargin: true,
        readOnly: readOnly || false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 16 }
      }}
    />
  );
}

function addCommentDecorations(editor: any, monaco: any, comments: Comment[]) {
  const decorations = comments.map((comment) => ({
    range: new monaco.Range(comment.lineNumber, 1, comment.lineNumber, 1),
    options: {
      glyphMarginClassName: 'comment-glyph-marker',
      glyphMarginHoverMessage: { value: `**${comment.authorName}:** ${comment.text}` },
    },
  }));
  editor.deltaDecorations([], decorations);
}

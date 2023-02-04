import Paper from '@mui/material/Paper';
import type { SxProps } from '@mui/material/styles';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { IFunction } from '../data/IFunction';
import Box from '@mui/material/Box';
import { FunctionId } from '../data/identifiers';

export interface Props extends IFunction {
    id?: FunctionId;
    setBody: (body: string) => void;
}

const rootStyle: SxProps = {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'stretch',
    padding: '0.5em',
    '& > :last-child': {
        flexGrow: 1,
    },
}

const preStyle: SxProps = { 
    margin: 0,
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: 16,
}

const editorStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: 16,
}

function writeSignature(functionName: string, parameters: readonly string[]) {
    let result = `function ${functionName}(`;

    if (parameters.length <= 3) {
        result += parameters.join(', ');
    }
    else {
        result += parameters
            .map(name => `\n  ` + name)
            .join(',') + '\n';
    }

    result += `) {`;
    
    return result;
}

export const FunctionEditor: React.FC<Props> = props => {
    const functionName = props.id ?? 'newFunction';

    return (
        <Paper sx={rootStyle} elevation={3}>
            <Box sx={preStyle} component="pre" dangerouslySetInnerHTML={{ __html: highlight(writeSignature(functionName, props.parameters), languages.js) }} />
            <Editor
                value={props.body}
                onValueChange={props.setBody}
                highlight={body => highlight(body, languages.js)}
                padding={12}
                style={editorStyle}
            />
            <Box sx={preStyle} component="pre" dangerouslySetInnerHTML={{ __html: highlight('}', languages.js) }} />
        </Paper>
    );
}
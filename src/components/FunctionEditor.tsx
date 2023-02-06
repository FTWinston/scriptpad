import SaveIcon from '@mui/icons-material/Save';
import { SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './FunctionEditor.css'; // Ideally the themes would via link elements, e.g. <link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />
import { FunctionId, IFunction } from '../data/IFunction';
import { makeValidFunctionName } from '../utils/makeValidFunctionName';

export interface Props extends IFunction {
    id: FunctionId | null;
    setBody: (body: string) => void;
    saveChanges: () => void;
    hasChanges: boolean;
}

const rootStyle: SxProps = {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'stretch',
    padding: '0.5em',
    flexGrow: 1,
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

const fabStyle: SxProps = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    display: 'flex',
    gap: 2,
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
    const functionName = props.id === null
        ? 'newFunction'
        : makeValidFunctionName(props.id);

    return (
        <Box sx={rootStyle}>
            <Box sx={preStyle} component="pre" dangerouslySetInnerHTML={{ __html: highlight(writeSignature(functionName, props.parameters), languages.js) }} />
            <Editor
                value={props.body}
                onValueChange={props.setBody}
                highlight={body => highlight(body, languages.js)}
                padding={18}
                style={editorStyle}
            />
            <Box sx={preStyle} component="pre" dangerouslySetInnerHTML={{ __html: highlight('}', languages.js) }} />

            <Fab
                color="secondary"
                aria-label="save function"
                onClick={props.saveChanges}
                sx={fabStyle}
                disabled={!props.hasChanges}
            >
                <SaveIcon />
            </Fab>
        </Box>
    );
}
import { immerable } from 'immer';
import { IFunction } from '../data/IFunction';

type RunResult = {
    success: true;
    output: string;
} | {
    success: false;
    error: string;
}

export class UserFunction {
    [immerable] = true;

    constructor(private _parameters: readonly string[], private _body: string) {
        this.createFunction();
    }

    public get parameters(): readonly string[] { return this._parameters; }
    public set parameters(newParameters: readonly string[]) {
        this._parameters = newParameters;
        this.createFunction();
    }

    public get body() { return this._body; }
    public set body(newBody: string) {
        this._body = newBody;
        this.createFunction();
    }

    private _function!: Function;
    private _parseError?: string;

    public run(inputs: string[]): RunResult {
        if (this._parseError !== undefined) {
            return {
                success: false,
                error: this._parseError,
            };
        }

        try {
            const returnValue = this._function(...inputs);

            return {
                success: true,
                output: returnValue === undefined || returnValue === null 
                    ? ''
                    : String(returnValue),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : String(error),
            };
        }
    }

    private createFunction() {
        try
        {
            this._function = new Function(...this._parameters, this._body);
            delete this._parseError;
        }
        catch (error)
        {
            const message = error instanceof Error
                ? error.message
                : String(error);
            
            this._function = () => '';
            this._parseError = message;
        }
    }

    public toJson(): IFunction {
        return ({
            parameters: this._parameters,
            body: this._body,
        })
    }
}
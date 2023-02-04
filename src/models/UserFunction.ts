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

    private _valid!: boolean;
    private _function!: Function;

    public get valid() { return this._valid; }
    public run(inputs: string[]): RunResult {
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
            this._valid = true;
        }
        catch (error)
        {
            const message = error instanceof Error
                ? error.message
                : String(error);
            
            console.log(`Error parsing function:`, message);

            this._function = () => '';
            this._valid = false;
        }
    }

    public toJson(): IFunction {
        return ({
            parameters: this._parameters,
            body: this._body,
        })
    }
}
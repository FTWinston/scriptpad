import { immerable } from 'immer';

export interface IFunction {
    parameters: readonly string[];
    body: string;
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
    public run(inputs: string[]) {
        try {
            return this._function(...inputs);
        }
        catch (ex) {
            console.log(`Error running function`, ex);
            this._valid = false;
            return '';
        }
    }

    private createFunction() {
        try
        {
            this._function = new Function(...this._parameters, this._body);
            this._valid = true;
        }
        catch (ex)
        {
            console.log(`Error parsing function`, ex);
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

import { IFieldDefinition } from "./field-definition.interface";

export class BaseImmutable<T> {
    private _fieldDefs: { [key: string]: IFieldDefinition };
    get fieldDefs() {
        if (!this._fieldDefs)
            this._fieldDefs = {};
        return this._fieldDefs;
    }

    beforeFreeze() {};

    constructor(obj?: Partial<T>) {
        if (obj && this._fieldDefs) {
            Object.keys(this._fieldDefs).forEach(m => {
                if (obj.hasOwnProperty(m)) {
                    let newValue;
                    if (Array.isArray(obj[m])) {
                        newValue = [
                            ...(obj[m] as Array<any>).map(v => this._fieldDefs[m].typeDef ? new this._fieldDefs[m].typeDef(v) : v)
                        ];
                        Object.freeze(newValue);
                    } else {
                        newValue = this._fieldDefs[m].typeDef ? new this._fieldDefs[m].typeDef(obj[m]) : obj[m]; 
                    }

                    this[m] = newValue;
                }
            });
        }

        this.beforeFreeze();

        Object.freeze(this);
    }

    clone(): T {
        let currentProto = Object.getPrototypeOf(this);
        return new currentProto.constructor(this);
    }

    patch(obj: Partial<T>): T {
        let currentProto = Object.getPrototypeOf(this);
        return new currentProto.constructor({ ...this, ...obj });
    }

    toObject() {
        return JSON.parse(JSON.stringify(this));
    }
}